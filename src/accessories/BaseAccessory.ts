// Credit: https://github.com/dgreif/ring/blob/master/homebridge/base-accessory.ts
import {
	Characteristic,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	Logging,
	PlatformAccessory,
	Service,
	WithUUID,
} from 'homebridge'
import { publishReplay, refCount, take } from 'rxjs/operators'

import { Message } from '../protect/message'
import { Observable } from 'rxjs'

export type CharacteristicType = WithUUID<{ new (): Characteristic }>
export type ServiceType = WithUUID<typeof Service> | Service

function isServiceInstance(serviceType: ServiceType): serviceType is Service {
	return typeof (serviceType as any) === 'object'
}

export default abstract class BaseAccessory<DeviceType extends { name: string }> {
	private servicesInUse: Service[] = []

	constructor(
		public readonly log: Logging,
		public readonly platformAccessory: PlatformAccessory,
		public readonly device: DeviceType,
		public readonly stream: Observable<Message>,
	) {
		this.log.info(`Discovered ${this.constructor.name}: ${device.name}`)
	}

	getService(serviceType: ServiceType, name = this.device.name, subType?: string) {
		if (isServiceInstance(serviceType)) {
			return serviceType
		}

		const existingService = subType
				? this.platformAccessory.getServiceById(serviceType, subType)
				: this.platformAccessory.getService(serviceType),
			service =
				existingService || this.platformAccessory.addService(serviceType, name, subType)

		if (!this.servicesInUse.includes(service)) {
			this.servicesInUse.push(service)
		}

		return service
	}

	registerObservableCharacteristic<T extends CharacteristicValue>({
		characteristicType,
		serviceType,
		serviceSubType,
		onValue,
		setValue,
		name,
		requestUpdate,
	}: {
		characteristicType: CharacteristicType
		serviceType: ServiceType
		serviceSubType?: string
		onValue: Observable<T>
		setValue?: (value: T) => any
		name?: string
		requestUpdate?: () => any
	}) {
		const service = this.getService(serviceType, name, serviceSubType)
		const characteristic = service.getCharacteristic(characteristicType)
		const onCachedValue = onValue.pipe(publishReplay(1), refCount())

		onCachedValue.subscribe(value => {
			characteristic.updateValue(value)
		})

		if (requestUpdate) {
			// Only register for GET if an async request should be made to get an updated value
			onCachedValue.pipe(take(1)).subscribe(() => {
				// allow GET once a value is cached
				characteristic.on(
					CharacteristicEventTypes.GET,
					async (callback: CharacteristicGetCallback) => {
						try {
							const value = await onCachedValue.pipe(take(1)).toPromise()
							callback(null, value)
							requestUpdate()
						} catch (error) {
							callback(error)
						}
					},
				)
			})
		}

		if (setValue) {
			characteristic.on(
				CharacteristicEventTypes.SET,
				(newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
					Promise.resolve(setValue(newValue as T)).catch(error => {
						this.log.error(error)
					})
					callback()
				},
			)
		}
	}
}
