import { platformName, pluginName } from './config'

import { API } from 'homebridge'
import UnifiPlatform from './UnifiPlatform'

export default function registerPlatform(homebridge: API) {
	homebridge.registerPlatform(pluginName, platformName, UnifiPlatform)
}
