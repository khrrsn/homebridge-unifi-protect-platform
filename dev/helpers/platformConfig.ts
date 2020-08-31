import dotenv from 'dotenv'
import { parseConfig } from '../../src/config'
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

export default platformConfig
