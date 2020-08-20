export interface Camera {
	id: string
	mac: string
	host: string
	type: string
	name: string
	platform: string
	hasSpeaker: boolean
	firmwareVersion: string
	isMicEnabled: boolean
	lastRing?: number | null
	chimeDuration?: number
	talkbackSettings?: {
		typeFmt: string
		typeIn: string
		bindAddr: string
		bindPort: number
		channels: number
		samplingRate: number
		bitsPerSample: number
		quality: number
	}
	featureFlags?: {
		hasChime: boolean
		hasMic: boolean
		hasSpeaker: boolean
	}
	lcdMessage?: any
	modelKey: string
}

export interface Nvr {
	mac: string
	host: string
	name: string
	firmwareVersion: string
	hardwarePlatform: string
	hardwareId: string
	ports: {
		rtsp: number
		rtmp: number
		cameraHttps: number
		cameraTcp: number
		tcpStreams: number
	}
	doorbellSettings?: {
		defaultMessageText: string
		defaultMessageResetTimeoutMs: number
		customMessages: string[]
		allMessages: string[]
	}
}
