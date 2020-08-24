import { Camera } from '../protect/api'
import { Stats } from '../protect/message'
import { characteristic } from './characteristic'
import { filter, map } from 'rxjs/operators'
import compactMap from '../operators/compactMap'

const batteryCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.BatteryLevel,
		serviceType: Service.BatteryService,
		observable: stream.pipe(
			compactMap(message => {
				if (!('stats' in message.body)) {
					return undefined
				}

				return message.body.stats.battery?.percentage
			}),
		),
	})
}

batteryCharacteristic.isAvailable = device => device.featureFlags?.hasBattery === true

export default batteryCharacteristic
