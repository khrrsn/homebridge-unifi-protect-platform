import { FetchIt, FetchitRequestInit } from 'fetchit/lib/types/fetchit'
import fetchit from 'fetchit'
import { ResourceProvider } from '../providers/resourceProvider'

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
	motionZones: {
		name: string
		color: string
		points: any[]
		sensitivity: number
	}[]
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
		hasBattery: boolean
	}
	channels: Channel[]
	lcdMessage?: any
	modelKey: string
}

export interface Channel {
	enabled: boolean
	isRtspEnabled: boolean
	videoId: string
	name: string
	rtspAlias?: string | null
	fps: number
	bitrate: number
	minBitrate: number
	maxBitrate: number
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

export interface ApiRequestInit extends FetchitRequestInit {
	timeout?: number
}

export type Headers = Record<string, string>

const headers = <Headers>{}
let defaultTimeout = 0

const api = <FetchIt>function api(uri: string, options?: ApiRequestInit): Promise<Response> {
	options = options ?? {}
	options.timeout = options.timeout ?? defaultTimeout
	options.headers = Object.assign({}, headers, options.headers ?? {})

	return fetchit(uri, options).then(response => {
		const csrf = response.headers.get('X-CSRF-Token')
		const cookie = response.headers.get('Set-Cookie')

		if (csrf && csrf.length > 0) {
			headers['X-CSRF-Token'] = csrf
		}

		if (cookie && cookie.length > 0) {
			headers['Cookie'] = cookie
		}

		return response
	})
}

export default api

export function getHeaders(): Headers {
	return { ...headers }
}

export function init({ log, config }: ResourceProvider): Promise<void> {
	if ((headers['X-CSRF-Token']?.length ?? 0) > 0 && (headers.Cookie?.length ?? 0) > 0) {
		return Promise.resolve()
	}

	log.info('Intiailizing')
	defaultTimeout = config.timeouts.default
	return api(config.controller_url).then(() => undefined)
}

api.json = (...args) => {
	return api(...args).then(response => response.json())
}

api.text = (...args) => {
	return api(...args).then(response => response.text())
}
