import { Camera } from '../protect/api'
import { accessory } from './accessory'

const typeAllowlist = new Set(['UVC G4 Doorbell'])

export default <accessory<Camera>>function doorbellAccessory() {
	// TODO
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
