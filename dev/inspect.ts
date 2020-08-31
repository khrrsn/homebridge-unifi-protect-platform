/**
 * Helper script that outputs devices/config from bootstrap
 */

import bootstrap from '../src/protect/bootstrap'
import log from './helpers/log'
import login from '../src/protect/login'
import parseOptions from './helpers/parseOptions'
import platformConfig from './helpers/platformConfig'
import resourceProvider from '../src/providers/resourceProvider'

const opts = parseOptions('dev:inspect', {
	'no-cameras': Boolean,
	'no-nvr': Boolean,
	'users': Boolean,
	'groups': Boolean,
	'liveviews': Boolean,
})

async function run() {
	const resources = resourceProvider(<any>{}, log, platformConfig)
	await login(resources)
	const info = await bootstrap(resources)

	if (opts.cameras === false) {
		delete info.cameras
	}

	if (opts.nvr === false) {
		delete info.nvr
	}

	if (opts.users !== true) {
		delete (info as any).users
	}

	if (opts.groups !== true) {
		delete (info as any).groups
	}

	if (opts.liveviews !== true) {
		delete (info as any).liveviews
	}

	console.log(info)
}

run().catch(console.error)
