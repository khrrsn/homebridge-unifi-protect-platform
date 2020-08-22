import { Camera } from '../protect/api'
import CameraAccessoryStreamingDelegate from './cameraAccessory/CameraAccessoryStreamingDelegate'
import { accessory } from './accessory'

export default <accessory<Camera>>function cameraAccessory(resources, services, device) {
	const streamingDelegate = new CameraAccessoryStreamingDelegate(resources, device)
	services.platformAccessory.configureController(streamingDelegate.controller)
}
