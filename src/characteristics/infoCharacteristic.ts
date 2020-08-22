import { Camera } from '../protect/api'
import { characteristic } from './characteristic'

const infoCharacteristic = <characteristic<Camera>>function (resources, services, _stream) {
	const { Characteristic, Service } = resources.hap
	const { device } = services
	resources.log.info(`Discovered: ${device.name}`)

	services.registerCharacteristic({
		characteristicType: Characteristic.Manufacturer,
		serviceType: Service.AccessoryInformation,
		getValue: () => 'UniFi',
	})
	services.registerCharacteristic({
		characteristicType: Characteristic.Model,
		serviceType: Service.AccessoryInformation,
		getValue: () => device.type,
	})
	services.registerCharacteristic({
		characteristicType: Characteristic.SerialNumber,
		serviceType: Service.AccessoryInformation,
		getValue: () => device.id,
	})
	services.registerCharacteristic({
		characteristicType: Characteristic.FirmwareRevision,
		serviceType: Service.AccessoryInformation,
		getValue: () => device.firmwareVersion,
	})
}

infoCharacteristic.isAvailable = () => true

export default infoCharacteristic
