import { Camera, Nvr } from './api'

import { Logging } from 'homebridge'
import { LoginHeaders } from './login'
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
	headers: LoginHeaders,
): Promise<BootstrapResponse> {
	log.debug(`Bootstrapping`)
	return fetchit.json(`${config.api_url}/bootstrap`, { headers })
}
