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
	body: any
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
