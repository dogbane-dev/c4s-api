import { parseDeferredReadableStream } from '@remix-run/react/dist/data'

export const parseRemixBody = async <T>(
	body: ReadableStream,
	abort?: AbortSignal,
): Promise<T> => {
	const abortSignal = abort ?? new AbortController().signal
	const deferredData = await parseDeferredReadableStream(body)
	await deferredData.resolveData(abortSignal)
	return deferredData.unwrappedData as T
}

export class C4SClipNotFoundError extends Error {
	constructor() {
		super('Clip not found')
	}
}

export class C4SStudioNotFoundError extends Error {
	constructor() {
		super('Studio not found')
	}
}
