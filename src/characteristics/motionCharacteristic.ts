import { Camera } from '../protect/api'
import { characteristic } from './characteristic'
import { map } from 'rxjs/operators'
import filterEvents from './operators/filterEvents'

const motionCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
	const { Characteristic, Service } = hap

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.MotionDetected,
		serviceType: Service.MotionSensor,
		observable: stream.pipe(
			filterEvents('motion'),
			map(body => !('end' in body) || (body.end ?? 0) <= 0),
		),
	})
}

motionCharacteristic.isAvailable = device => (device.motionZones?.length ?? 0) > 0

export default motionCharacteristic
