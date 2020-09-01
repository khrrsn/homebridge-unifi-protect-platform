import { SnapshotRequest, SnapshotRequestCallback } from 'homebridge'

import { BootstrappedResourceProvider } from '../../providers/resourceProvider'
import { Camera } from '../../protect/api'
import { StreamingDelegate as FfmpegStreamingDelegate } from 'homebridge-camera-ffmpeg/dist/streamingDelegate'
import { VideoConfig } from 'homebridge-camera-ffmpeg/dist/configTypes'
import observeSnapshots from './observeSnapshots'
import { take } from 'rxjs/operators'

export default class CameraStreamingDelegate extends FfmpegStreamingDelegate {
	private snapshots = observeSnapshots(this.resources, this.device)

	constructor(private resources: BootstrappedResourceProvider, private device: Camera) {
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
		this.snapshots.pipe(take(1)).subscribe(
			snapshot => {
				callback(undefined, snapshot)
			},
			error => {
				this.resources.log.debug(`Failed to fetch snapshot for ${this.device.name}.`, error)
				callback(error)
			},
		)
	}

	private static generateVideoConfig(
		resources: BootstrappedResourceProvider,
		device: Camera,
	): VideoConfig {
		const channels = device.channels.filter(
			value => value.isRtspEnabled && typeof value.rtspAlias === 'string',
		)

		if (channels.length === 0) {
			throw new Error('No available channels')
		}

		const [channel] = channels
		return {
			source: `-rtsp_transport tcp -re -i rtsp://${resources.nvr.host}:${
				resources.nvr.ports.rtsp
			}/${channel.rtspAlias!}`,
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
			debugReturn: false,
			videoFilter: undefined as any,
			returnAudioTarget: undefined as any,
		}
	}
}
