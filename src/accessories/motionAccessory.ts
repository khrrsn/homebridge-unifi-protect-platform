import { Camera } from '../protect/api'
import { accessory } from './accessory'
import { filter, map } from 'rxjs/operators'

export default <accessory<Camera>>function motionAccessory({ hap }, services, _device, stream) {
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

export function hasMotionDetection(camera: Camera) {
	return camera.motionZones?.length ?? 0 > 0
}
