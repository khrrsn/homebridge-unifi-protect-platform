import { Observable, ReplaySubject, defer, from, of, race } from 'rxjs'
import api, { Camera } from '../../protect/api'
import { catchError, delay, filter, tap, timeout } from 'rxjs/operators'

import { ResourceProvider } from '../../providers/resourceProvider'

export default function observeSnapshots(
	{ config, log }: ResourceProvider,
	device: Camera,
): Observable<Buffer> {
	// Setup cache subject
	const cache = new ReplaySubject<Buffer>(1)

	// Establish race between fetch and cache
	return race(
		// Cache will either be available or not, so we setup a delay equal to timeout snapshot
		cache.pipe(
			delay(config.timeouts.snapshot),
			tap(() => log.debug(`Snapshot took too long, using cache for ${device.name}.`)),
		),

		// Fire request for new snapshot
		defer(() => {
			log.debug(`Fetching snapshot for ${device.name}`)
			return from(
				api.buffer(`${config.api_url}/cameras/${device.id}/snapshot`).then(value => {
					// We have to do this as part of the promise and not tap to ensure it fires
					// If we used pipe/tap and cache wins the race, it would never fire
					cache.next(value)
					return value
				}),
			)
		}).pipe(
			// If we fail to fetch, we want to eat the error so cache can take over
			catchError(error => {
				log.debug(`Failed to fetch snapshot for ${device.name}.`, error)
				return of(undefined)
			}),
			filter(value => value !== undefined),
		) as Observable<Buffer>,
	).pipe(
		// Protects against scenario where cache is empty and request takes too long
		timeout(config.timeouts.snapshot + 10),
	)
}
