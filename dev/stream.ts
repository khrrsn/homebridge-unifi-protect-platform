/**
 * Helper script to stream all events from the websocket
 */

import bootstrap from '../src/protect/bootstrap'
import chalk from 'chalk'
import { filter } from 'rxjs/operators'
import log from './helpers/log'
import login from '../src/protect/login'
import parseOptions from './helpers/parseOptions'
import platformConfig from './helpers/platformConfig'
import resourceProvider from '../src/providers/resourceProvider'
import stream from '../src/protect/stream'

const opts = parseOptions('dev:stream', {
	'verbose': Boolean,
	'no-nvr': Boolean,
	'no-user': Boolean,
})

async function run() {
	const resources = resourceProvider(<any>{}, log, platformConfig)
	await login(resources)
	const json = await bootstrap(resources)
	const cameras = new Map<string, string>()

	for (const camera of json.cameras) {
		cameras.set(camera.id, selectFormatter(camera.name).bold(camera.name))
	}

	const maxCameraLength = Array.from(cameras.values()).reduce(
		(prev, cur) => Math.max(prev, cur.length),
		0,
	)

	stream(resources, json)
		.pipe(
			filter(message => opts.nvr !== false || message.header.modelKey !== 'nvr'),
			filter(message => opts.user !== false || message.header.modelKey !== 'user'),
		)
		.subscribe(({ header, body }) => {
			const message: any[] = [
				chalk.dim(new Date().toISOString()),
				selectFormatter(header.modelKey)(`<${header.modelKey.padEnd(6)}>`),
			]

			if (cameras.has(header.id)) {
				message.push(cameras.get(header.id)!.padEnd(maxCameraLength))
			}

			if (!opts.verbose && 'stats' in body) {
				message.push(chalk.dim('stats <truncated>'))
			} else if (!opts.verbose && 'wifiConnectionState' in body) {
				message.push(chalk.dim('wifiConnectionState <truncated>'))
			} else {
				message.push(body)
			}

			console.log(...message)
		})
}

const formatters = [chalk.yellow, chalk.green, chalk.magenta, chalk.blue, chalk.cyan]

function selectFormatter(namespace: string) {
	// Credit: debug
	let hash = 0

	for (let i = 0; i < namespace.length; i++) {
		hash = (hash << 5) - hash + namespace.charCodeAt(i)
		hash |= 0 // Convert to 32bit integer
	}

	return formatters[Math.abs(hash) % formatters.length]
}

run().catch(console.error)
