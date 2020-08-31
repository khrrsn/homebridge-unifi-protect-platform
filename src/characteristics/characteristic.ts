import { BootstrappedResourceProvider } from '../providers/resourceProvider'
import { Message } from '../protect/message'
import { Observable } from 'rxjs'
import { ServicesProvider } from '../providers/servicesProvider'

export interface characteristic<DeviceType extends { name: string }> {
	(
		resources: BootstrappedResourceProvider,
		services: ServicesProvider<DeviceType>,
		stream: Observable<Message>,
	): void

	isAvailable(device: DeviceType): boolean
}
