import { Camera } from '../protect/api'
import { accessory } from './accessory'
import { filter, map } from 'rxjs/operators'

const motionAccessory = <accessory<Camera>>function motionAccessory({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.MotionDetected,
		serviceType: Service.MotionSensor,
		onValue: stream.pipe(
			filter(message => typeof message.body?.isMotionDetected === 'boolean'),
			map(message => message.body?.isMotionDetected ?? false),
		),
	})
}

motionAccessory.isAvailable = device => {
	return (device.motionZones?.length ?? 0) > 0
}

export default motionAccessory
