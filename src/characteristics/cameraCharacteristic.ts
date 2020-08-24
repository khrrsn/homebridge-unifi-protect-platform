import { Camera } from '../protect/api'
import CameraStreamingDelegate from './cameraCharacteristic/CameraStreamingDelegate'
import { characteristic } from './characteristic'

const cameraCharacteristic = <characteristic<Camera>>function (resources, services, _stream) {
	const streamingDelegate = new CameraStreamingDelegate(resources, services.device)
	services.platformAccessory.configureController(streamingDelegate.controller)
}

cameraCharacteristic.isAvailable = () => true

export default cameraCharacteristic
