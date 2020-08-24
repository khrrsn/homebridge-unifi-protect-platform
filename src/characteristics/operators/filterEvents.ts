import { CameraEvent, CameraEventEnd, CameraEventType, Message } from '../../protect/message'

import compactMap from '../../operators/compactMap'

export default function filterEvents(type?: CameraEventType) {
	return compactMap<Message, CameraEvent | CameraEventEnd>(message =>
		message.header.modelKey === 'event' &&
		('start' in message.body || 'end' in message.body) &&
		(!type || message.body.type === type)
			? message.body
			: undefined,
	)
}
