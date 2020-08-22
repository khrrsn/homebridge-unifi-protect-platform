import api, { Camera, Nvr } from './api'

import { Logging } from 'homebridge'
import { UnifiPlatformConfig } from '../config'
import fetchit from 'fetchit'

export interface BootstrapResponse {
	lastUpdateId: string
	authUserId: string
	accessKey: string
	cameras: Camera[]
	nvr: Nvr
}

export default function bootstrap(
	log: Logging,
	config: UnifiPlatformConfig,
): Promise<BootstrapResponse> {
	log.debug(`Bootstrapping`)
	return api.json(`${config.api_url}/bootstrap`)
}
