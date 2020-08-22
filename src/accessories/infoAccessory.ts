import { Camera } from '../protect/api'
import { accessory } from './accessory'

const infoAccessory = <accessory<Camera>>function infoAccessory(resources, services, device, _stream) {
	const { Characteristic, Service } = resources.hap
	resources.log.info(`Discovered: ${services.device.name}`)

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

infoAccessory.isAvailable = () => true

export default infoAccessory
