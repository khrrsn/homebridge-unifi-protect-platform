import { Camera } from '../protect/api'
import { characteristic } from './characteristic'
import { filter, mapTo } from 'rxjs/operators'

const typeAllowlist = new Set(['UVC G4 Doorbell'])

const doorbellCharacteristic = <characteristic<Camera>>function ({ hap }, services, stream) {
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

doorbellCharacteristic.isAvailable = device => {
	return (
		typeAllowlist.has(device.type) ||
		(device.featureFlags?.hasChime === true &&
			device.featureFlags?.hasMic === true &&
			device.featureFlags?.hasSpeaker === true) ||
		/doorbell/i.test(device.type)
	)
}

export default doorbellCharacteristic