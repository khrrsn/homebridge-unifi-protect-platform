import { Camera } from '../protect/api'
import CameraCharacteristicStreamingDelegate from './cameraCharacteristic/CameraCharacteristicStreamingDelegate'
import { characteristic } from './characteristic'

const cameraCharacteristic = <characteristic<Camera>>function (resources, services, _stream) {
	const streamingDelegate = new CameraCharacteristicStreamingDelegate(resources, services.device)
	services.platformAccessory.configureController(streamingDelegate.controller)
}

cameraCharacteristic.isAvailable = () => true

export default cameraCharacteristic
