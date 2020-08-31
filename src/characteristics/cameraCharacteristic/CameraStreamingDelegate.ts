import { SnapshotRequest, SnapshotRequestCallback } from 'homebridge'
import api, { Camera } from '../../protect/api'

import { StreamingDelegate as FfmpegStreamingDelegate } from 'homebridge-camera-ffmpeg/dist/streamingDelegate'
import { ResourceProvider } from '../../providers/resourceProvider'

export default class CameraStreamingDelegate extends FfmpegStreamingDelegate {
	constructor(private resources: ResourceProvider, private device: Camera) {
		super(
			resources.log as any,
			{
				name: device.name,
				manufacturer: 'UniFi',
				model: device.type,
				serialNumber: device.mac,
				firmwareRevision: device.firmwareVersion,
				motion: true,
				doorbell: false,
				switches: false,
				motionTimeout: 10,
				unbridge: false,
				videoConfig: CameraStreamingDelegate.generateVideoConfig(resources, device),
			},
			resources.api,
			resources.hap,
			'ffmpeg',
		)
	}

	async handleSnapshotRequest(request: SnapshotRequest, callback: SnapshotRequestCallback) {
		try {
			this.resources.log.debug(`Fetching snapshot for ${this.device.name}`)
			const response = await api(
				`${this.resources.config.api_url}/cameras/${this.device.id}/snapshot`,
				{
					timeout: this.resources.config.timeouts.snapshot,
				} as any,
			)
			callback(undefined, await (response as any).buffer())
		} catch (error) {
			this.resources.log.debug(`Error fetching snapshot for ${this.device.name}`, error)
			callback(error)
		}
	}

	private static generateVideoConfig(resources: ResourceProvider, device: Camera): any {
		const channels = device.channels.filter(
			value => value.isRtspEnabled && typeof value.rtspAlias === 'string',
		)

		if (channels.length === 0) {
			throw new Error('No available channels')
		}

		const [channel] = channels
		return {
			source: `-i ${resources.config.controller_rtsp}/${channel.rtspAlias!}`,
			stillImageSource: '',
			maxStreams: 2,
			maxWidth: 1920,
			maxHeight: 1080,
			maxFPS: channel.fps,
			maxBitrate: channel.maxBitrate / 1000,
			forceMax: false,
			vcodec: 'copy',
			packetSize: 188,
			encoderOptions: '-protocol_whitelist https,crypto,srtp,rtp,udp -loglevel verbose',
			mapvideo: '0:1',
			mapaudio: '0:0',
			audio: false,
			debug: false,
		}
	}
}
