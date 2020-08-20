import { Camera } from '../protect/api'
import CameraAccessory from './CameraAccessory'

const typeAllowlist = new Set(['UVC G4 Doorbell'])

export default class DoorbellAccessory extends CameraAccessory {
	//
}

export function isDoorbell(camera: Camera) {
	return (
		typeAllowlist.has(camera.type) ||
		(camera.featureFlags?.hasChime === true &&
			camera.featureFlags?.hasMic === true &&
			camera.featureFlags?.hasSpeaker === true) ||
		/doorbell/i.test(camera.type)
	)
}
