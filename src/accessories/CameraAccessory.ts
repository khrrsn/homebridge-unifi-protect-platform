import BaseAccessory from './BaseAccessory'
import { Camera } from '../protect/api'
import { CameraAccessoryStreamingDelegate } from './CameraAccessoryStreamingDelegate'

export default class CameraAccessory extends BaseAccessory<Camera> {
	private streamingDelegate?: CameraAccessoryStreamingDelegate

	protected setup() {
		const { Characteristic, Service } = this.resources.hap

		this.streamingDelegate = new CameraAccessoryStreamingDelegate(this.resources, this.device)
		this.services.platformAccessory.configureController(this.streamingDelegate.controller)

		this.services.registerCharacteristic({
			characteristicType: Characteristic.Manufacturer,
			serviceType: Service.AccessoryInformation,
			getValue: () => 'UniFi',
		})
		this.services.registerCharacteristic({
			characteristicType: Characteristic.Model,
			serviceType: Service.AccessoryInformation,
			getValue: () => this.device.type,
		})
		this.services.registerCharacteristic({
			characteristicType: Characteristic.SerialNumber,
			serviceType: Service.AccessoryInformation,
			getValue: () => this.device.id,
		})
		this.services.registerCharacteristic({
			characteristicType: Characteristic.FirmwareRevision,
			serviceType: Service.AccessoryInformation,
			getValue: () => this.device.firmwareVersion,
		})
	}
}
