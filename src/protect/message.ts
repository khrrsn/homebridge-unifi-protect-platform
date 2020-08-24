import zlib from 'zlib'

export const HEADER_SIZE = 8

export enum HeaderBytes {
	TYPE = 0, // UInt8
	FORMAT = 1, // UInt8
	IS_COMPRESSED = 2, // UInt8
	RESERVED = 3, // UInt8
	LENGTH = 4, // UInt32BE
}

export interface Message {
	header: {
		action: string
		newUpdateId: string
		modelKey: 'camera' | 'light' | 'nvr' | 'sensor' | 'viewer' | 'user' | 'event'
		id: string
	}
	body:
		| { stats: Stats }
		| { lastSeen: number; uptime?: number }
		| {
				wifiConnectionState: WifiConnectionState
		  }
		| { isDark: boolean }
		| CameraEvent
		| CameraEventEnd
}

export interface WifiConnectionState {
	channel: number
	frequency: number
	linkSpeedMbps: number | null
	signalQuality: number
	signalStrength: number
}

export interface Stats {
	rxBytes: number
	txBytes: number
	wifi?: WifiConnectionState | null
	battery?: { percentage: number | null; isCharging: boolean; sleepState: string }
	video: {
		recordingStart: number
		recordingEnd: number
		recordingStartLQ: number
		recordingEndLQ: number
		timelapseStart: number
		timelapseEnd: number
		timelapseStartLQ: number
		timelapseEndLQ: number
	}
	storage: { used: number; rate: number }
}

export type CameraEventType = 'motion' | 'ring'
export interface CameraEvent {
	type: CameraEventType
	start: number
	end?: number
	score: number
	camera: string
	partition: null
	metadata: {
		objectType: string | null
		objectCoords: string | null
		objectConfidence: number | null
	}
	id: string
	modelKey: string
}

export interface CameraEventEnd {
	type: CameraEventType
	end: number
	score: number
}

export function parseMessageSection(message: Buffer): any {
	const format = message.readUInt8(HeaderBytes.FORMAT)
	const isCompressed = !!message.readUInt8(HeaderBytes.IS_COMPRESSED)
	let data = message.slice(HEADER_SIZE)

	if (isCompressed) {
		data = zlib.inflateSync(data)
	}

	if (format === 1) {
		data = JSON.parse(<any>data)
	}

	return data
}
