import { Message } from '../protect/message'
import { Observable } from 'rxjs'
import { ResourceProvider } from '../providers/resourceProvider'
import { ServicesProvider } from '../providers/servicesProvider'

export interface characteristic<DeviceType extends { name: string }> {
	(
		resources: ResourceProvider,
		services: ServicesProvider<DeviceType>,
		stream: Observable<Message>,
	): void

	isAvailable(device: DeviceType): boolean
}
