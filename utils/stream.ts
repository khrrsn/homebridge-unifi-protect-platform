/**
 * Helper script to stream all events from the websocket
 */

import { parseConfig } from '../src/config'
import dotenv from 'dotenv'
import connect from '../src/protect/connect'
dotenv.config()

const platformConfig = parseConfig({
	name: 'name',
	platform: 'name',
	unifi: {
		controller_url: process.env.UNIFI_CONTROLLER_URL,
		controller_rtsp: process.env.UNIFI_CONTROLLER_URL,
		api_url: process.env.UNIFI_API_URL,
		ws_url: process.env.UNIFI_WS_URL,
		username: process.env.UNIFI_USERNAME,
		password: process.env.UNIFI_PASSWORD,
	},
})

const log = {
	prefix: 'unifi',
	debug: console.log.bind(console, 'debug'),
	info: console.log.bind(console, 'info'),
	warn: console.log.bind(console, 'warn'),
	error: console.log.bind(console, 'error'),
	log: console.log.bind(console, 'log'),
}

connect(<any>log, platformConfig).subscribe(data => {
	console.log(data)
})
