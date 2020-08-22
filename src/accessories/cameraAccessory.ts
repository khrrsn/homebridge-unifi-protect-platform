import { Camera } from '../protect/api'
import CameraAccessoryStreamingDelegate from './cameraAccessory/CameraAccessoryStreamingDelegate'
import { accessory } from './accessory'

export default <accessory<Camera>>function cameraAccessory(resources, services, device) {
	const { Characteristic, Service } = resources.hap

	const streamingDelegate = new CameraAccessoryStreamingDelegate(resources, device)
	services.platformAccessory.configureController(streamingDelegate.controller)

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
