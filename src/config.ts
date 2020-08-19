import { PlatformConfig } from 'homebridge'
import path from 'path'
import url from 'url'

export const pluginName = 'homebridge-unifi-doorbell'
export const platformName = 'unifi-doorbell'

export interface UnifiPlatformConfig {
	controller_url: string
	api_url: string
	ws_url: string
	controller_rtsp: string
	username: string
	password: string
}

export function parseConfig(
	config: PlatformConfig & { unifi?: Partial<UnifiPlatformConfig> },
): UnifiPlatformConfig {
	if (!config.unifi) {
		throw new Error('Config not found, ignoring plugin.')
	}

	if (!config.unifi.username) {
		throw new Error('Username not set, ignoring plugin.')
	}

	if (!config.unifi.password) {
		throw new Error('Password not set, ignoring plugin.')
	}

	if (!config.unifi.controller_rtsp) {
		throw new Error('Password not set, ignoring plugin.')
	}

	if (!config.unifi.controller_url) {
		throw new Error('Controller URL not set, ignoring plugin.')
	}

	const parsed = url.parse(config.unifi.controller_url)

	if (!config.unifi.api_url) {
		const api = { ...parsed }
		api.pathname = path.join(api.pathname || api.path || '', 'proxy/protect/api')
		config.unifi.api_url = url.format(api)
	}

	if (!config.unifi.ws_url) {
		const ws = { ...parsed }
		ws.protocol = ws.protocol === 'http:' ? 'ws:' : 'wss:'
		ws.pathname = path.join(ws.pathname || ws.path || '', 'proxy/protect/ws/updates')
		config.unifi.ws_url = url.format(ws)
	}

	return {
		controller_url: config.unifi.controller_url,
		api_url: config.unifi.api_url,
		ws_url: config.unifi.ws_url,
		controller_rtsp: config.unifi.controller_rtsp,
		username: config.unifi.username,
		password: config.unifi.password,
	}
}
