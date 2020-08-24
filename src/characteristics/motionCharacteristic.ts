import { Camera } from '../protect/api'
import { characteristic } from './characteristic'
import { filter, map } from 'rxjs/operators'

const motionCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.MotionDetected,
		serviceType: Service.MotionSensor,
		observable: stream.pipe(
			filter(
				message =>
					message.header.modelKey === 'event' &&
					'type' in message.body &&
					message.body.type === 'motion',
			),
			map(message => !('end' in message.body) || (message.body.end ?? 0) <= 0),
		),
	})
}

motionCharacteristic.isAvailable = device => (device.motionZones?.length ?? 0) > 0

export default motionCharacteristic
