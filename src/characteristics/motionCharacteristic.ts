import { Camera } from '../protect/api'
import { characteristic } from './characteristic'
import { filter, map } from 'rxjs/operators'

const motionCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.MotionDetected,
		serviceType: Service.MotionSensor,
		observable: stream.pipe(
			filter(message => typeof message.body?.isMotionDetected === 'boolean'),
			map(message => message.body?.isMotionDetected ?? false),
		),
	})
}

motionCharacteristic.isAvailable = device => (device.motionZones?.length ?? 0) > 0

export default motionCharacteristic
