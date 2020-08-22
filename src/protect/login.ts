import api, { init } from './api'

import { Logging } from 'homebridge'
import { UnifiPlatformConfig } from '../config'

export default async function login(log: Logging, config: UnifiPlatformConfig): Promise<void> {
	await init(log, config)
	log.debug(`Logging in as ${config.username}`)
	await api(`${config.controller_url}/api/auth/login`, {
		body: { username: config.username, password: config.password },
		method: 'POST',
	})
}
