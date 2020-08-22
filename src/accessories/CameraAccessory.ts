import BaseAccessory from './BaseAccessory'
import { Camera } from '../protect/api'
import { CameraAccessoryStreamingDelegate } from './CameraAccessoryStreamingDelegate'

export default class CameraAccessory extends BaseAccessory<Camera> {
	private streamingDelegate?: CameraAccessoryStreamingDelegate

	protected setup() {
		const { Characteristic, Service } = this.api.hap

		this.streamingDelegate = new CameraAccessoryStreamingDelegate(
			this.api,
			this.log,
			this.config,
			this.device,
		)
		this.platformAccessory.configureController(this.streamingDelegate.controller)

		this.registerCharacteristic({
			characteristicType: Characteristic.Manufacturer,
			serviceType: Service.AccessoryInformation,
			getValue: () => 'UniFi',
		})
		this.registerCharacteristic({
			characteristicType: Characteristic.Model,
			serviceType: Service.AccessoryInformation,
			getValue: () => this.device.type,
		})
		this.registerCharacteristic({
			characteristicType: Characteristic.SerialNumber,
			serviceType: Service.AccessoryInformation,
			getValue: () => this.device.id,
		})
		this.registerCharacteristic({
			characteristicType: Characteristic.FirmwareRevision,
			serviceType: Service.AccessoryInformation,
			getValue: () => this.device.firmwareVersion,
		})
	}
}
