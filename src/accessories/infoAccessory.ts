import { Camera } from '../protect/api'
import { accessory } from './accessory'

export default <accessory<Camera>>function infoAccessory(resources, services, device) {
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
