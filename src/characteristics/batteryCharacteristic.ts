import { Camera } from '../protect/api'
import { characteristic } from './characteristic'
import { filter, map } from 'rxjs/operators'

const batteryCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.BatteryLevel,
		serviceType: Service.BatteryService,
		onValue: stream.pipe(
			filter(message => typeof message.body?.stats?.percentage === 'number'),
			map(message => message.body!.stats!.percentage),
		),
	})
}

batteryCharacteristic.isAvailable = device => device.featureFlags?.hasBattery === true

export default batteryCharacteristic
