import { Message } from '../protect/message'
import { ResourceProvider } from '../providers/resourceProvider'
import { ServicesProvider } from '../providers/servicesProvider'
import { Observable } from 'rxjs'

export interface accessory<DeviceType extends { name: string }> {
	(
		resources: ResourceProvider,
		services: ServicesProvider<DeviceType>,
		stream: Observable<Message>,
	): void

	isAvailable(device: DeviceType): boolean
}
