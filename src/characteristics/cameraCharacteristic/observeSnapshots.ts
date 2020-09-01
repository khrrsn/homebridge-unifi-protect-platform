import { Observable, defer, from, of } from 'rxjs'
import api, { Camera } from '../../protect/api'
import { catchError, timeout } from 'rxjs/operators'

import { ResourceProvider } from '../../providers/resourceProvider'

export default function observeSnapshots(
	{ config, log }: ResourceProvider,
	device: Camera,
): Observable<Buffer> {
	let cachedSnapshot: Buffer | undefined
	return defer(() => {
		log.debug(`Fetching snapshot for ${device.name}`)
		return from(
			api(`${config.api_url}/cameras/${device.id}/snapshot`)
				.then(response => (response as any).buffer())
				.then(value => {
					cachedSnapshot = value
					return value as Buffer
				}),
		)
	}).pipe(
		timeout(config.timeouts.snapshot),
		catchError(error => {
			if (!cachedSnapshot) {
				log.debug(`Failed to fetch snapshot for ${device.name}, cache empty.`, error)
				throw error
			}

			log.debug(`Failed to fetch snapshot for ${device.name}, falling back to cache.`, error)
			return of(cachedSnapshot)
		}),
	)
}
