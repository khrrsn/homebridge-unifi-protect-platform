import api, { Camera, Nvr } from './api'

import { ResourceProvider } from '../providers/resourceProvider'

export interface BootstrapResponse {
	lastUpdateId: string
	authUserId: string
	accessKey: string
	cameras: Camera[]
	nvr: Nvr
}

export default function bootstrap({ log, config }: ResourceProvider): Promise<BootstrapResponse> {
	log.debug('Bootstrapping')
	return api.json(`${config.api_url}/bootstrap`)
}
