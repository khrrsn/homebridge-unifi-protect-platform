import { UnifiPlatformConfig } from '../config'
import fetchit from 'fetchit'

export default async function login(config: UnifiPlatformConfig) {
	const csrf = (await fetchit(config.controller_url)).headers.get('x-csrf-token')
	const login = await fetchit(`${config.controller_url}/api/auth/login`, {
		body: { username: config.username, password: config.password },
		method: 'POST',
		headers: {
			'X-CSRF-Token': csrf ?? '',
		},
	})

	return {
		'X-CSRF-Token': login.headers.get('X-CSRF-Token') ?? '',
		'Cookie': login.headers.get('Set-Cookie') ?? '',
	}
}
