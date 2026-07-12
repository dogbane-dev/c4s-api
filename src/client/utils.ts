import { parseDeferredReadableStream } from '../utils/vendor/react-router'

/**
 * Parses a Remix deferred response body into the resolved data object.
 *
 * @param body - Remix deferred response body as a `ReadableStream` or string.
 * @param abort - Optional abort signal used while resolving deferred data.
 * @returns The parsed and unwrapped Remix deferred payload.
 */
export const parseRemixBody = async <T>(
	body: ReadableStream | string,
	abort?: AbortSignal,
): Promise<T> => {
	const abortSignal = abort ?? new AbortController().signal

	const stream =
		typeof body === 'string'
			? new ReadableStream({
					start: (c) => {
						c.enqueue(new TextEncoder().encode(body))
						c.close()
					},
				})
			: body

	const deferredData = await parseDeferredReadableStream(stream)
	await deferredData.resolveData(abortSignal)
	return deferredData.unwrappedData as T
}

/**
 * Error thrown when Clips4Sale reports that a requested clip does not exist.
 */
export class C4SClipNotFoundError extends Error {
	constructor() {
		super('Clip not found')
	}
}

/**
 * Error thrown when Clips4Sale reports that a requested studio does not exist.
 */
export class C4SStudioNotFoundError extends Error {
	constructor() {
		super('Studio not found')
	}
}

/**
 * Error thrown for failed Clips4Sale API responses or client-level API failures.
 */
export class C4SApiError extends Error {
	/**
	 * Creates a Clips4Sale API error.
	 *
	 * @param responseOrMessage - Response-like status object or error message to
	 * include in the error.
	 */
	constructor(
		responseOrMessage: Pick<Response, 'status' | 'statusText'> | string,
	) {
		super(
			typeof responseOrMessage === 'string'
				? responseOrMessage
				: `Received response status ${responseOrMessage.status} ${responseOrMessage.statusText ? ` (${responseOrMessage.statusText})` : ''}`,
		)
	}
}
