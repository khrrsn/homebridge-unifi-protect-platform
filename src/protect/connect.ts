import { Observable, from } from 'rxjs'
import { map, switchMap, scan, filter } from 'rxjs/operators'

import { Logging } from 'homebridge'
import { UnifiPlatformConfig } from '../config'
import WebSocket from 'ws'
import fetchit from 'fetchit'
import login from './login'
import { webSocket } from 'rxjs/webSocket'
import { HEADER_SIZE, HeaderBytes, parseMessageSection, Message } from './message'

interface BufferAcc {
	buffer?: Buffer
	message?: {
		buffer: Buffer
		bodyOffset: number
	}
}

export default function connect(log: Logging, config: UnifiPlatformConfig): Observable<Message> {
	log.debug('Logging in')
	return from(login(config)).pipe(
		// Call bootstrap API to get lastUpdateId
		switchMap(headers =>
			from(
				fetchit
					.json(`${config.api_url}/bootstrap`, { headers })
					.then(
						result =>
							<[Record<string, string>, string]>[
								headers,
								<string>result.lastUpdateId,
							],
					),
			),
		),

		// Open websocket
		switchMap(([headers, lastUpdateId]) => {
			const url = `${config.ws_url}?lastUpdateId=${lastUpdateId}`
			log.debug('Opening socket', url)
			return webSocket({
				url,

				// Default deserializer will parse JSON, we need to maintain Buffer
				deserializer: event => <BufferAcc>{ buffer: event.data },

				// webSocket doesn’t support passing through headers, so need this nasty workaround
				WebSocketCtor: <any>class InternalWebSocket extends WebSocket {
					constructor(url: string) {
						super(url, { headers })
					}
				},
			})
		}),

		// Buffer/chunk messages until we have a complete header+body pair
		scan((acc: BufferAcc, value: BufferAcc) => {
			const buffer = acc.buffer ? Buffer.concat([acc.buffer, value.buffer!]) : value.buffer!
			acc.buffer = buffer

			if (buffer.length < HEADER_SIZE) {
				return {}
			}

			const headerLength = buffer.readUInt32BE(HeaderBytes.LENGTH)
			const bodyOffset = headerLength + HEADER_SIZE

			if (buffer.length < bodyOffset + HEADER_SIZE) {
				return {}
			}

			const bodyLength = buffer.readUInt32BE(bodyOffset + HeaderBytes.LENGTH)
			const bodyEnd = bodyOffset + HEADER_SIZE + bodyLength

			if (buffer.length < bodyEnd) {
				return {}
			}

			acc.buffer = buffer.slice(bodyEnd)

			return {
				message: {
					buffer: buffer.slice(0, bodyEnd),
					bodyOffset,
				},
			}
		}, {}),

		// Filter out blank messages — which indicates we’re still buffering
		filter(value => value.message !== undefined),

		// Parse into Message
		map(value => ({
			header: parseMessageSection(value.message!.buffer.slice(0, value.message!.bodyOffset)),
			body: parseMessageSection(value.message!.buffer.slice(value.message!.bodyOffset)),
		})),
	)
}
