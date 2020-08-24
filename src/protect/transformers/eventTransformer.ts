import { Message, CameraEventType } from '../message'

type EventData = { camera: string; type: CameraEventType }
const events = new Map<string, EventData>()

// Transforms event payloads to be used in a stateless manner
// For start/end events, header.id is remapped to the camera id
// For end events, the event type from start is added to the body
export default function eventTransformer(message: Message): Message {
	if (message.header.modelKey !== 'event') {
		return message
	}

	// Events can be fired as ongoing or instantaneous
	// We only want to store events for ongoing events
	if ('camera' in message.body && !message.body.end) {
		events.set(message.header.id, {
			camera: message.body.camera,
			type: message.body.type,
		})

		message.header.id = message.body.camera
	} else if ('end' in message.body && events.has(message.header.id)) {
		const { camera, type } = <EventData>events.get(message.header.id)
		events.delete(message.header.id)

		message.header.id = camera
		message.body.type = type
	}

	return message
}
