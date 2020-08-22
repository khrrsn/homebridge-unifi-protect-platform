import {
	AudioStreamingCodecType,
	AudioStreamingSamplerate,
	CameraController,
	CameraStreamingDelegate,
	H264Level,
	H264Profile,
	PrepareStreamCallback,
	PrepareStreamRequest,
	SRTPCryptoSuites,
	SnapshotRequest,
	SnapshotRequestCallback,
	StreamRequestCallback,
	StreamingRequest,
} from 'homebridge'

import api, { Camera } from '../../protect/api'
import { ResourceProvider } from '../../providers/resourceProvider'

export default class CameraAccessoryStreamingDelegate implements CameraStreamingDelegate {
	readonly controller: CameraController

	constructor(private resources: ResourceProvider, private device: Camera) {
		this.controller = new resources.hap.CameraController({
			cameraStreamCount: 2,
			delegate: this,
			streamingOptions: {
				supportedCryptoSuites: [SRTPCryptoSuites.AES_CM_128_HMAC_SHA1_80],
				video: {
					resolutions: [
						[1280, 720, 30],
						[1024, 768, 30],
						[640, 480, 30],
						[640, 360, 30],
						[480, 360, 30],
						[480, 270, 30],
						[320, 240, 30],
						[320, 240, 15], // Apple Watch requires this configuration
						[320, 180, 30],
					],
					codec: {
						profiles: [H264Profile.BASELINE],
						levels: [H264Level.LEVEL3_1],
					},
				},
				audio: {
					codecs: [
						{
							type: AudioStreamingCodecType.AAC_ELD,
							samplerate: AudioStreamingSamplerate.KHZ_16,
						},
					],
				},
			},
		})
	}

	async handleSnapshotRequest(request: SnapshotRequest, callback: SnapshotRequestCallback) {
		try {
			this.resources.log.debug(`Fetching snapshot for ${this.device.name}`)
			const response = await api(
				`${this.resources.config.api_url}/cameras/${this.device.id}/snapshot`,
				<any>{
					timeout: this.resources.config.timeouts.snapshot,
				},
			)
			callback(undefined, await (<any>response).buffer())
		} catch (error) {
			this.resources.log.debug(`Error fetching snapshot for ${this.device.name}`, error)
			callback(error)
		}
	}

	prepareStream(request: PrepareStreamRequest, callback: PrepareStreamCallback) {
		this.resources.log.info('prepareStream', this.device.name)
		callback(new Error('TODO'))
	}

	handleStreamRequest(request: StreamingRequest, callback: StreamRequestCallback) {
		this.resources.log.info('handleStreamRequest', this.device.name)
		callback(new Error('TODO'))
	}
}
