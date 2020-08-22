import { Camera } from '../protect/api'
import CameraAccessoryStreamingDelegate from './cameraAccessory/CameraAccessoryStreamingDelegate'
import { accessory } from './accessory'

const cameraAccessory = <accessory<Camera>>function cameraAccessory(resources, services, _stream) {
	const streamingDelegate = new CameraAccessoryStreamingDelegate(resources, services.device)
	services.platformAccessory.configureController(streamingDelegate.controller)
}

cameraAccessory.isAvailable = device => true

export default cameraAccessory
