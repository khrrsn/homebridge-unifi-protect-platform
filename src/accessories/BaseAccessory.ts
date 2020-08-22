import { Message } from '../protect/message'
import { Observable } from 'rxjs'
import { ResourceProvider } from '../providers/resourceProvider'
import { ServicesProvider } from '../providers/servicesProvider'

export default abstract class BaseAccessory<DeviceType extends { name: string }> {
	readonly device: DeviceType

	constructor(
		public readonly resources: ResourceProvider,
		public readonly services: ServicesProvider<DeviceType>,
		public readonly stream: Observable<Message>,
	) {
		this.resources.log.info(`Discovered ${this.constructor.name}: ${services.device.name}`)
		this.device = services.device
		this.setup()
	}

	protected setup() {
		//
	}
}
