import { API, HAP, Logging } from 'homebridge'

import { Nvr } from '../protect/api'
import { UnifiPlatformConfig } from '../config'

export interface ResourceProvider {
	api: API
	log: Logging
	config: UnifiPlatformConfig
	hap: HAP
}

export interface BootstrappedResourceProvider extends ResourceProvider {
	nvr: Nvr
}

export default function resourceProvider(
	api: API,
	log: Logging,
	config: UnifiPlatformConfig,
): Readonly<ResourceProvider> {
	return Object.freeze({ api, log, config, hap: api.hap })
}

export function bootstrappedResourceProvider(
	resourceProvider: ResourceProvider,
	{ nvr }: { nvr: Nvr },
): Readonly<BootstrappedResourceProvider> {
	return Object.freeze({ ...resourceProvider, nvr: Object.freeze({ ...nvr }) })
}
