import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from 'homebridge'
import { UnifiPlatformConfig, parseConfig } from './config'

import login from './protect/login'
import bootstrap from './protect/bootstrap'
import stream from './protect/stream'
import { Message } from './protect/message'
import { Observable, Subject } from 'rxjs'
import { multicast, filter } from 'rxjs/operators'
import infoAccessory from './accessories/infoAccessory'
import cameraAccessory from './accessories/cameraAccessory'
import doorbellAccessory, { isDoorbell } from './accessories/doorbellAccessory'
import motionAccessory, { hasMotionDetection } from './accessories/motionAccessory'
import { platformName, pluginName } from './config'
import resourceProvider, { ResourceProvider } from './providers/resourceProvider'
import servicesProvider from './providers/servicesProvider'

export default class UnifiPlatform implements DynamicPlatformPlugin {
	private resources: ResourceProvider
	private stream?: Observable<Message>
	private readonly platformAccessories = new Map<string, PlatformAccessory>()

	constructor(
		log: Logging,
		config: PlatformConfig & { unifi?: Partial<UnifiPlatformConfig> },
		api: API,
	) {
		try {
			this.resources = resourceProvider(api, log, parseConfig(config))
		} catch (error) {
			log.error(error.message)
			this.resources = <any>{} // Silence ts error
			return
		}

		this.resources.api.on('didFinishLaunching', async () => {
			try {
				await this.didFinishLaunching()
			} catch (error) {
				log.error(error)
			}
		})
	}

	private async didFinishLaunching() {
		await login(this.resources)
		const json = await bootstrap(this.resources)
		this.stream = stream(this.resources, json).pipe(multicast(() => new Subject<Message>()))

		const newPlatformAccessories: PlatformAccessory[] = []
		const activeAccessoryIds = new Set<string>()
		const cachedAccessoryIds = Array.from(this.platformAccessories.keys())
		const { api, hap, log } = this.resources

		for (const camera of json.cameras) {
			const uuid = api.hap.uuid.generate(camera.id)
			const stream = this.stream.pipe(filter(message => message.header.id === camera.id))

			const platformAccessory =
				this.platformAccessories.get(uuid) ??
				(() => {
					const accessory = new api.platformAccessory(
						camera.name,
						uuid,
						hap.Categories.CAMERA,
					)

					log.info(`Adding new accessory ${uuid}: ${camera.type}/${camera.name}`)
					newPlatformAccessories.push(accessory)

					return accessory
				})()

			const services = servicesProvider(this.resources, platformAccessory, camera)
			infoAccessory(this.resources, services, camera, stream)
			cameraAccessory(this.resources, services, camera, stream)

			if (isDoorbell(camera)) {
				doorbellAccessory(this.resources, services, camera, stream)
			}

			if (hasMotionDetection(camera)) {
				motionAccessory(this.resources, services, camera, stream)
			}

			this.platformAccessories.set(uuid, platformAccessory)
			activeAccessoryIds.add(uuid)
		}

		if (newPlatformAccessories.length > 0) {
			api.registerPlatformAccessories(pluginName, platformName, newPlatformAccessories)
		}

		const staleAccessories = <PlatformAccessory[]>(
			cachedAccessoryIds
				.filter(uuid => !activeAccessoryIds.has(uuid) && this.platformAccessories.has(uuid))
				.map(uuid => this.platformAccessories.get(uuid))
		)

		staleAccessories.forEach(staleAccessory => {
			log.info(
				`Removing stale cached accessory ${staleAccessory.UUID} ${staleAccessory.displayName}`,
			)
		})

		if (staleAccessories.length) {
			api.unregisterPlatformAccessories(pluginName, platformName, staleAccessories)
		}
	}

	configureAccessory(accessory: PlatformAccessory) {
		this.resources.log.info(
			`Configuring cached accessory ${accessory.UUID} ${accessory.displayName}`,
		)
		this.platformAccessories.set(accessory.UUID, accessory)
	}
}
