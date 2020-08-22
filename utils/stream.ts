/**
 * Helper script to stream all events from the websocket
 */

import { Logging } from 'homebridge'
import { parseConfig } from '../src/config'
import dotenv from 'dotenv'
import login from '../src/protect/login'
import bootstrap from '../src/protect/bootstrap'
import stream from '../src/protect/stream'
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

const log = <Logging>{
	prefix: 'unifi',
	debug: console.log.bind(console, 'debug'),
	info: console.log.bind(console, 'info'),
	warn: console.log.bind(console, 'warn'),
	error: console.log.bind(console, 'error'),
	log: console.log.bind(console, 'log'),
}

async function run() {
	await login(log, platformConfig)
	const json = await bootstrap(log, platformConfig)
	stream(log, platformConfig, json).subscribe(data => {
		console.log(data)
	})
}

run().catch(console.error)
