import {
	Characteristic,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	PlatformAccessory,
	Service,
	WithUUID,
} from 'homebridge'
import { publishReplay, refCount, take } from 'rxjs/operators'

import { Observable } from 'rxjs'
import { ResourceProvider } from './resourceProvider'

export type CharacteristicType = WithUUID<{ new (): Characteristic }>
export type ServiceType = WithUUID<typeof Service> | Service

// Credit: https://github.com/dgreif/ring/blob/master/homebridge/base-accessory.ts

export interface ServicesProvider<DeviceType extends { name: string }> {
	readonly servicesInUse: Service[]
	readonly device: DeviceType
	readonly platformAccessory: PlatformAccessory
	getService(serviceType: ServiceType): Service
	getService(serviceType: ServiceType, name: string, subType?: string): Service

	registerCharacteristic(params: {
		characteristicType: CharacteristicType
		serviceType: ServiceType
		serviceSubType?: string
		name?: string
		getValue: () => any
		setValue?: (data: any) => any
	}): void

	registerObservableCharacteristic<T extends CharacteristicValue>(params: {
		characteristicType: CharacteristicType
		serviceType: ServiceType
		serviceSubType?: string
		observable: Observable<T>
		setValue?: (value: T) => any
		name?: string
		requestUpdate?: () => any
	}): void
}

export default function servicesProvider<DeviceType extends { name: string }>(
	resources: ResourceProvider,
	accessory: PlatformAccessory,
	device: DeviceType,
): ServicesProvider<DeviceType> {
	return {
		servicesInUse: [],

		get device(): DeviceType {
			return device
		},

		get platformAccessory(): PlatformAccessory {
			return accessory
		},

		getService(
			serviceType: ServiceType,
			name: string = device.name,
			subType?: string,
		): Service {
			if (isServiceInstance(serviceType)) {
				return serviceType
			}

			const existingService = subType
					? accessory.getServiceById(serviceType, subType)
					: accessory.getService(serviceType),
				service = existingService || accessory.addService(serviceType, name, subType)

			if (!this.servicesInUse.includes(service)) {
				this.servicesInUse.push(service)
			}

			return service
		},

		registerObservableCharacteristic({
			characteristicType,
			serviceType,
			serviceSubType,
			observable,
			setValue,
			name,
			requestUpdate,
		}) {
			const service = this.getService(serviceType, name ?? device.name, serviceSubType)
			const characteristic = service.getCharacteristic(characteristicType)
			const cachedObservable = observable.pipe(publishReplay(1), refCount())

			cachedObservable.subscribe(value => {
				console.log('update value', value)
				characteristic.updateValue(value)
			})

			if (requestUpdate) {
				// Only register for GET if an async request should be made to get an updated value
				cachedObservable.pipe(take(1)).subscribe(() => {
					// allow GET once a value is cached
					characteristic.on(
						CharacteristicEventTypes.GET,
						async (callback: CharacteristicGetCallback) => {
							try {
								const value = await cachedObservable.pipe(take(1)).toPromise()
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
						Promise.resolve(setValue(<any>newValue)).catch(error => {
							resources.log.error(error)
						})
						callback()
					},
				)
			}
		},

		registerCharacteristic({
			characteristicType,
			serviceType,
			getValue,
			setValue,
			name,
			serviceSubType,
		}) {
			const service = this.getService(serviceType, name ?? device.name, serviceSubType)
			const characteristic = service.getCharacteristic(characteristicType)

			if (setValue) {
				characteristic.on(
					CharacteristicEventTypes.SET,
					(newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
						Promise.resolve(setValue(newValue)).catch(e => {
							resources.log.error(e)
						})
						callback()
					},
				)
			}

			characteristic.on(
				CharacteristicEventTypes.GET,
				(callback: CharacteristicGetCallback) => {
					Promise.resolve(getValue())
						.then(value => {
							callback(null, value)
						})
						.catch(error => {
							resources.log.error(error)
							callback(error)
						})
				},
			)

			characteristic.emit(CharacteristicEventTypes.GET, (error: any, value: any) => {
				if (error || !value) {
					return
				}

				characteristic.setValue(value)
			})
		},
	}
}

function isServiceInstance(serviceType: ServiceType): serviceType is Service {
	return typeof (serviceType as any) === 'object'
}
