import { Camera } from '../protect/api'
import { Stats } from '../protect/message'
import { characteristic } from './characteristic'
import { filter, map } from 'rxjs/operators'

const batteryCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.BatteryLevel,
		serviceType: Service.BatteryService,
		observable: stream.pipe(
			filter(
				message =>
					'stats' in message.body &&
					typeof message.body.stats.battery?.percentage === 'number',
			),
			map(message => (<Stats>(<any>message.body).stats).battery!.percentage as number),
		),
	})
}

batteryCharacteristic.isAvailable = device => device.featureFlags?.hasBattery === true

export default batteryCharacteristic
