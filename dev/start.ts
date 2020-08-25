import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { UnifiPlatformConfig } from '../src/config'
dotenv.config()

const fixtures = path.join(__dirname, './fixtures')
const config = require(path.join(fixtures, 'config/config.template.json'))
const platformConfig = <Partial<UnifiPlatformConfig>>config.platforms[0].unifi
platformConfig.controller_url = process.env.UNIFI_CONTROLLER_URL
platformConfig.api_url = process.env.UNIFI_API_URL
platformConfig.ws_url = process.env.UNIFI_WS_URL
platformConfig.username = process.env.UNIFI_USERNAME
platformConfig.password = process.env.UNIFI_PASSWORD

fs.writeFileSync(path.join(fixtures, 'config/config.json'), JSON.stringify(config, null, 2))

process.argv = [
	'',
	'',
	'--user-storage-path',
	path.join(fixtures, 'config'),
	'--plugin-path',
	path.join(fixtures, 'plugins'),
	'--debug',
	'--no-qrcode',
]

require('homebridge/lib/cli')()
