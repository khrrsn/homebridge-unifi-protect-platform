import cameraCharacteristic from './cameraCharacteristic'
import doorbellCharacteristic from './doorbellCharacteristic'
import infoCharacteristic from './infoCharacteristic'
import motionCharacteristic from './motionCharacteristic'

const characteristics = Object.freeze([
	infoCharacteristic, // Should always go first
	cameraCharacteristic,
	doorbellCharacteristic,
	motionCharacteristic,
])

export default characteristics
