import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from 'homebridge'
import { UnifiPlatformConfig, parseConfig } from './config'

import login from './protect/login'
import bootstrap from './protect/bootstrap'
import stream from './protect/stream'
import { Message } from './protect/message'
import { Observable, Subject } from 'rxjs'
import { multicast, filter } from 'rxjs/operators'
import CameraAccessory from './accessories/CameraAccessory'
import DoorbellAccessory, { isDoorbell } from './accessories/DoorbellAccessory'
import { platformName, pluginName } from './config'

export default class UnifiPlatform implements DynamicPlatformPlugin {
	private config: UnifiPlatformConfig
	private stream?: Observable<Message>
	private readonly platformAccessories = new Map<string, PlatformAccessory>()

	constructor(
		public log: Logging,
		config: PlatformConfig & { unifi?: Partial<UnifiPlatformConfig> },
		public api: API,
	) {
		try {
			this.config = parseConfig(config)
		} catch (error) {
			log.error(error.message)
			this.config = <any>{} // Silence ts error
			return
		}

		this.api.on('didFinishLaunching', async () => {
			try {
				await this.didFinishLaunching()
			} catch (error) {
				log.error(error)
			}
		})
	}

	private async didFinishLaunching() {
		await login(this.log, this.config)
		const json = await bootstrap(this.log, this.config)
		this.stream = stream(this.log, this.config, json).pipe(
			multicast(() => new Subject<Message>()),
		)

		const newPlatformAccessories: PlatformAccessory[] = []
		const activeAccessoryIds = new Set<string>()
		const cachedAccessoryIds = Array.from(this.platformAccessories.keys())

		for (const camera of json.cameras) {
			const uuid = this.api.hap.uuid.generate(camera.id)
			const stream = this.stream.pipe(filter(message => message.header.id === camera.id))

			const platformAccessory =
				this.platformAccessories.get(uuid) ??
				(() => {
					const accessory = new this.api.platformAccessory(
						camera.name,
						uuid,
						this.api.hap.Categories.CAMERA,
					)

					this.log.info(`Adding new accessory ${uuid}: ${camera.type}/${camera.name}`)
					newPlatformAccessories.push(accessory)

					return accessory
				})()

			if (isDoorbell(camera)) {
				new DoorbellAccessory(this.api, this.log, platformAccessory, camera, stream)
			} else {
				new CameraAccessory(this.api, this.log, platformAccessory, camera, stream)
			}

			this.platformAccessories.set(uuid, platformAccessory)
			activeAccessoryIds.add(uuid)
		}

		if (newPlatformAccessories.length > 0) {
			this.api.registerPlatformAccessories(pluginName, platformName, newPlatformAccessories)
		}

		const staleAccessories = <PlatformAccessory[]>(
			cachedAccessoryIds
				.filter(uuid => !activeAccessoryIds.has(uuid) && this.platformAccessories.has(uuid))
				.map(uuid => this.platformAccessories.get(uuid))
		)

		staleAccessories.forEach(staleAccessory => {
			this.log.info(
				`Removing stale cached accessory ${staleAccessory.UUID} ${staleAccessory.displayName}`,
			)
		})

		if (staleAccessories.length) {
			this.api.unregisterPlatformAccessories(pluginName, platformName, staleAccessories)
		}
	}

	configureAccessory(accessory: PlatformAccessory) {
		this.log.info(`Configuring cached accessory ${accessory.UUID} ${accessory.displayName}`)
		this.platformAccessories.set(accessory.UUID, accessory)
	}
}
