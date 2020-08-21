import BaseAccessory from './BaseAccessory'
import { Camera } from '../protect/api'

export default class CameraAccessory extends BaseAccessory<Camera> {
	protected setup() {
		const { Characteristic, Service } = this.api.hap
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
