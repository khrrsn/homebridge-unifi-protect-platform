import { Camera } from '../protect/api'
import { accessory } from './accessory'
import { filter, mapTo } from 'rxjs/operators'

const typeAllowlist = new Set(['UVC G4 Doorbell'])

export default <accessory<Camera>>function doorbellAccessory({ hap }, services, _device, stream) {
	const { Characteristic, Service } = hap
	const onRing = stream.pipe(filter(message => message.body?.type === 'ring'))

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.ProgrammableSwitchEvent,
		serviceType: Service.Doorbell,
		onValue: onRing.pipe(mapTo(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS)),
	})

	services.registerObservableCharacteristic({
		characteristicType: Characteristic.ProgrammableSwitchEvent,
		serviceType: Service.StatelessProgrammableSwitch,
		onValue: onRing.pipe(mapTo(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS)),
	})

	// Hide long and double press events by setting max value
	services
		.getService(Service.StatelessProgrammableSwitch)
		.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
		.setProps({
			maxValue: Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
		})
}

export function isDoorbell(camera: Camera) {
	return (
		typeAllowlist.has(camera.type) ||
		(camera.featureFlags?.hasChime === true &&
			camera.featureFlags?.hasMic === true &&
			camera.featureFlags?.hasSpeaker === true) ||
		/doorbell/i.test(camera.type)
	)
}
