import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from 'homebridge'
import { UnifiPlatformConfig, parseConfig } from './config'

import login from './protect/login'
import bootstrap from './protect/bootstrap'
import stream from './protect/stream'
import { Message } from './protect/message'
import { Observable } from 'rxjs'
import { share, filter } from 'rxjs/operators'
import characteristics from './characteristics'
import { platformName, pluginName } from './config'
import resourceProvider, {
	bootstrappedResourceProvider,
	ResourceProvider,
} from './providers/resourceProvider'
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
		const resources = bootstrappedResourceProvider(this.resources, json)
		this.stream = stream(resources, json).pipe(share())

		const newPlatformAccessories: PlatformAccessory[] = []
		const activeAccessoryIds = new Set<string>()
		const cachedAccessoryIds = Array.from(this.platformAccessories.keys())
		const { api, hap, log } = resources

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

			const services = servicesProvider(resources, platformAccessory, camera)
			for (const characteristic of characteristics) {
				if (!characteristic.isAvailable(camera)) {
					continue
				}

				characteristic(resources, services, stream)
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
