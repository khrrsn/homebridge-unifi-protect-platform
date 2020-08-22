import api, { init } from './api'

import { ResourceProvider } from '../providers/resourceProvider'

export default async function login(resources: ResourceProvider): Promise<void> {
	const { config } = resources
	await init(resources)
	resources.log.debug(`Logging in as ${config.username}`)
	await api(`${config.controller_url}/api/auth/login`, {
		body: { username: config.username, password: config.password },
		method: 'POST',
	})
}
