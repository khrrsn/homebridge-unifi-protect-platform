import { API, HAP, Logging } from 'homebridge'

import { UnifiPlatformConfig } from '../config'

export interface ResourceProvider {
	api: API
	log: Logging
	config: UnifiPlatformConfig
	hap: HAP
}

export default function resourceProvider(
	api: API,
	log: Logging,
	config: UnifiPlatformConfig,
): Readonly<ResourceProvider> {
	return Object.freeze({ api, log, config, hap: api.hap })
}
