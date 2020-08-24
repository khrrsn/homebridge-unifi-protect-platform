/**
 * Helper script to stream all events from the websocket
 */

import { Logging } from 'homebridge'
import bootstrap from '../src/protect/bootstrap'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { filter } from 'rxjs/operators'
import login from '../src/protect/login'
import nopt from 'nopt'
import { parseConfig } from '../src/config'
import resourceProvider from '../src/providers/resourceProvider'
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

const options = {
	'verbose': Boolean,
	'no-nvr': Boolean,
	'no-user': Boolean,
	'help': Boolean,
}
const opts = nopt(options)

if (opts.help) {
	console.log(
		chalk.dim('yarn dev:stream'),
		...Object.keys(options)
			.filter(value => value !== 'help')
			.map(value => chalk.dim(`[--${value}]`)),
	)
	process.exit(0)
}

async function run() {
	const resources = resourceProvider(<any>{}, log, platformConfig)
	await login(resources)
	const json = await bootstrap(resources)
	const cameras = new Map<string, string>()

	for (const camera of json.cameras) {
		cameras.set(camera.id, selectFormatter(camera.name).bold(camera.name))
	}

	const maxCameraLength = Array.from(cameras.values()).reduce(
		(prev, cur) => Math.max(prev, cur.length),
		0,
	)

	stream(resources, json)
		.pipe(
			filter(message => opts.nvr !== false || message.header.modelKey !== 'nvr'),
			filter(message => opts.user !== false || message.header.modelKey !== 'user'),
		)
		.subscribe(({ header, body }) => {
			const message: any[] = [
				chalk.dim(new Date().toISOString()),
				selectFormatter(header.modelKey)(`<${header.modelKey.padEnd(6)}>`),
			]

			if (cameras.has(header.id)) {
				message.push(cameras.get(header.id)!.padEnd(maxCameraLength))
			}

			if (!opts.verbose && 'stats' in body) {
				message.push(chalk.dim('stats <truncated>'))
			} else if (!opts.verbose && 'wifiConnectionState' in body) {
				message.push(chalk.dim('wifiConnectionState <truncated>'))
			} else {
				message.push(body)
			}

			console.log(...message)
		})
}

const formatters = [chalk.yellow, chalk.green, chalk.magenta, chalk.blue, chalk.cyan]

function selectFormatter(namespace: string) {
	// Credit: debug
	let hash = 0

	for (let i = 0; i < namespace.length; i++) {
		hash = (hash << 5) - hash + namespace.charCodeAt(i)
		hash |= 0 // Convert to 32bit integer
	}

	return formatters[Math.abs(hash) % formatters.length]
}

run().catch(console.error)
