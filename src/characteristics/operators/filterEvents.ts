import { CameraEvent, CameraEventEnd, Message } from '../../protect/message'

import compactMap from '../../operators/compactMap'

export default function filterEvents() {
	return compactMap<Message, CameraEvent | CameraEventEnd>(message =>
		message.header.modelKey === 'event' && ('start' in message.body || 'end' in message.body)
			? message.body
			: undefined,
	)
}
