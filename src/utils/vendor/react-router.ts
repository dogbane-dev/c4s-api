/** biome-ignore-all lint/suspicious/noAssignInExpressions: copied from Remix */
/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

// From Remix Run React and Router v2
// https://github.com/remix-run/remix/blob/9989381a2c9c188071a08ef1aba4c49ce9db85c8/packages/remix-react/data.ts

// ------ Router ------

function invariant(value: boolean, message?: string): asserts value
function invariant<T>(
	value: T | null | undefined,
	message?: string,
): asserts value is T
function invariant(value: any, message?: string) {
	if (value === false || value === null || typeof value === 'undefined') {
		throw new Error(message)
	}
}

interface TrackedPromise extends Promise<any> {
	_tracked?: boolean
	_data?: any
	_error?: any
}

function isTrackedPromise(value: any): value is TrackedPromise {
	return value instanceof Promise && (value as TrackedPromise)._tracked === true
}

function unwrapTrackedPromise(value: any) {
	if (!isTrackedPromise(value)) {
		return value
	}

	if (value._error) {
		throw value._error
	}
	return value._data
}

class DeferredData {
	private pendingKeysSet: Set<string> = new Set<string>()
	private controller: AbortController
	private abortPromise: Promise<void>
	private unlistenAbortSignal: () => void
	private subscribers: Set<(aborted: boolean, settledKey?: string) => void> =
		new Set()
	data: Record<string, unknown>
	init?: ResponseInit
	deferredKeys: string[] = []

	constructor(data: Record<string, unknown>, responseInit?: ResponseInit) {
		invariant(
			data && typeof data === 'object' && !Array.isArray(data),
			'defer() only accepts plain objects',
		)

		// Set up an AbortController + Promise we can race against to exit early
		// cancellation
		let reject: (e: AbortedDeferredError) => void
		this.abortPromise = new Promise((_, r) => (reject = r))
		this.controller = new AbortController()
		const onAbort = () =>
			reject(new AbortedDeferredError('Deferred data aborted'))
		this.unlistenAbortSignal = () =>
			this.controller.signal.removeEventListener('abort', onAbort)
		this.controller.signal.addEventListener('abort', onAbort)

		this.data = Object.entries(data).reduce(
			(acc, [key, value]) =>
				Object.assign(acc, {
					[key]: this.trackPromise(key, value),
				}),
			{},
		)

		if (this.done) {
			// All incoming values were resolved
			this.unlistenAbortSignal()
		}

		this.init = responseInit
	}

	private trackPromise(
		key: string,
		value: Promise<unknown> | unknown,
	): TrackedPromise | unknown {
		if (!(value instanceof Promise)) {
			return value
		}

		this.deferredKeys.push(key)
		this.pendingKeysSet.add(key)

		// We store a little wrapper promise that will be extended with
		// _data/_error props upon resolve/reject
		const promise: TrackedPromise = Promise.race([
			value,
			this.abortPromise,
		]).then(
			(data) => this.onSettle(promise, key, undefined, data as unknown),
			(error) => this.onSettle(promise, key, error as unknown),
		)

		// Register rejection listeners to avoid uncaught promise rejections on
		// errors or aborted deferred values
		promise.catch(() => {})

		Object.defineProperty(promise, '_tracked', { get: () => true })
		return promise
	}

	private onSettle(
		promise: TrackedPromise,
		key: string,
		error: unknown,
		data?: unknown,
	): unknown {
		if (
			this.controller.signal.aborted &&
			error instanceof AbortedDeferredError
		) {
			this.unlistenAbortSignal()
			Object.defineProperty(promise, '_error', { get: () => error })
			return Promise.reject(error)
		}

		this.pendingKeysSet.delete(key)

		if (this.done) {
			// Nothing left to abort!
			this.unlistenAbortSignal()
		}

		// If the promise was resolved/rejected with undefined, we'll throw an error as you
		// should always resolve with a value or null
		if (error === undefined && data === undefined) {
			const undefinedError = new Error(
				`Deferred data for key "${key}" resolved/rejected with \`undefined\`, ` +
					`you must resolve/reject with a value or \`null\`.`,
			)
			Object.defineProperty(promise, '_error', { get: () => undefinedError })
			this.emit(false, key)
			return Promise.reject(undefinedError)
		}

		if (data === undefined) {
			Object.defineProperty(promise, '_error', { get: () => error })
			this.emit(false, key)
			return Promise.reject(error)
		}

		Object.defineProperty(promise, '_data', { get: () => data })
		this.emit(false, key)
		return data
	}

	private emit(aborted: boolean, settledKey?: string) {
		this.subscribers.forEach((subscriber) => subscriber(aborted, settledKey))
	}

	subscribe(fn: (aborted: boolean, settledKey?: string) => void) {
		this.subscribers.add(fn)
		return (): boolean => this.subscribers.delete(fn)
	}

	cancel(): void {
		this.controller.abort()
		this.pendingKeysSet.forEach((_v, k) => this.pendingKeysSet.delete(k))
		this.emit(true)
	}

	async resolveData(signal: AbortSignal): Promise<boolean> {
		let aborted = false
		if (!this.done) {
			const onAbort = () => this.cancel()
			signal.addEventListener('abort', onAbort)
			aborted = await new Promise((resolve) => {
				this.subscribe((aborted) => {
					signal.removeEventListener('abort', onAbort)
					if (aborted || this.done) {
						resolve(aborted)
					}
				})
			})
		}
		return aborted
	}

	get done(): boolean {
		return this.pendingKeysSet.size === 0
	}

	get unwrappedData(): {} {
		invariant(
			this.data !== null && this.done,
			'Can only unwrap data on initialized and settled deferreds',
		)

		return Object.entries(this.data).reduce(
			(acc, [key, value]) =>
				Object.assign(acc, {
					[key]: unwrapTrackedPromise(value),
				}),
			{},
		)
	}

	get pendingKeys(): string[] {
		return Array.from(this.pendingKeysSet)
	}
}

export declare class AbortedDeferredError extends Error {}

// ------ React ------

/**
 * Data for a route that was returned from a `loader()`.
 */
export type AppData = unknown

export function isCatchResponse(response: Response): boolean {
	return response.headers.get('X-Remix-Catch') != null
}

export function isErrorResponse(response: any): response is Response {
	return response.headers.get('X-Remix-Error') != null
}

export function isNetworkErrorResponse(response: any): response is Response {
	// If we reach the Remix server, we can safely identify response types via the
	// X-Remix-Error/X-Remix-Catch headers.  However, if we never reach the Remix
	// server, and instead receive a 4xx/5xx from somewhere in between (like
	// Cloudflare), then we get a false negative in the isErrorResponse check and
	// we incorrectly assume that the user returns the 4xx/5xx response and
	// consider it successful.  To alleviate this, we add X-Remix-Response to any
	// non-Error/non-Catch responses coming back from the server.  If we don't
	// see this, we can conclude that a 4xx/5xx response never actually reached
	// the Remix server and we can bubble it up as an error.
	return (
		isResponse(response) &&
		response.status >= 400 &&
		response.headers.get('X-Remix-Error') == null &&
		response.headers.get('X-Remix-Catch') == null &&
		response.headers.get('X-Remix-Response') == null
	)
}

export function isRedirectResponse(response: Response): boolean {
	return response.headers.get('X-Remix-Redirect') != null
}

export function isDeferredResponse(response: Response): boolean {
	return !!response.headers.get('Content-Type')?.match(/text\/remix-deferred/)
}

export function isResponse(value: any): value is Response {
	return (
		value != null &&
		typeof value.status === 'number' &&
		typeof value.statusText === 'string' &&
		typeof value.headers === 'object' &&
		typeof value.body !== 'undefined'
	)
}

export function isDeferredData(value: any): value is DeferredData {
	const deferred: DeferredData = value
	return (
		deferred &&
		typeof deferred === 'object' &&
		typeof deferred.data === 'object' &&
		typeof deferred.subscribe === 'function' &&
		typeof deferred.cancel === 'function' &&
		typeof deferred.resolveData === 'function'
	)
}

export async function fetchData(
	request: Request,
	routeId: string,
	retry = 0,
): Promise<Response | Error> {
	const url = new URL(request.url)
	url.searchParams.set('_data', routeId)

	if (retry > 0) {
		// Retry up to 3 times waiting 50, 250, 1250 ms
		// between retries for a total of 1550 ms before giving up.
		await new Promise((resolve) => setTimeout(resolve, 5 ** retry * 10))
	}

	const init = await createRequestInit(request)
	// @ts-expect-error - remix uses window with this property
	const revalidation = window.__remixRevalidation
	const response = await fetch(url.href, init).catch((error) => {
		if (
			typeof revalidation === 'number' &&
			// @ts-expect-error - remix uses window with this property
			revalidation === window.__remixRevalidation &&
			error?.name === 'TypeError' &&
			retry < 3
		) {
			return fetchData(request, routeId, retry + 1)
		}
		throw error
	})

	if (isErrorResponse(response)) {
		const data = await response.json()
		const error = new Error(data.message)
		error.stack = data.stack
		return error
	}

	if (isNetworkErrorResponse(response)) {
		const text = await response.text()
		const error = new Error(text)
		error.stack = undefined
		return error
	}

	return response
}

export async function createRequestInit(
	request: Request,
): Promise<RequestInit> {
	const init: RequestInit = { signal: request.signal }

	if (request.method !== 'GET') {
		init.method = request.method

		const contentType = request.headers.get('Content-Type')

		// Check between word boundaries instead of startsWith() due to the last
		// paragraph of https://httpwg.org/specs/rfc9110.html#field.content-type
		if (contentType && /\bapplication\/json\b/.test(contentType)) {
			init.headers = { 'Content-Type': contentType }
			init.body = JSON.stringify(await request.json())
		} else if (contentType && /\btext\/plain\b/.test(contentType)) {
			init.headers = { 'Content-Type': contentType }
			init.body = await request.text()
		} else if (
			contentType &&
			/\bapplication\/x-www-form-urlencoded\b/.test(contentType)
		) {
			init.body = new URLSearchParams(await request.text())
		} else {
			init.body = await request.formData()
		}
	}

	return init
}

const DEFERRED_VALUE_PLACEHOLDER_PREFIX = '__deferred_promise:'
export async function parseDeferredReadableStream(
	stream: ReadableStream<Uint8Array>,
): Promise<DeferredData> {
	if (!stream) {
		throw new Error('parseDeferredReadableStream requires stream argument')
	}

	let deferredData: Record<string, Promise<unknown>> | undefined
	const deferredResolvers: Record<
		string,
		{ resolve: (data: unknown) => void; reject: (error: unknown) => void }
	> = {}

	try {
		const sectionReader = readStreamSections(stream)

		// Read the first section to get the critical data
		const initialSectionResult = await sectionReader.next()
		const initialSection = initialSectionResult.value
		if (!initialSection) throw new Error('no critical data')
		const criticalData = JSON.parse(initialSection)

		// Setup deferred data and resolvers for later based on the critical data
		if (typeof criticalData === 'object' && criticalData !== null) {
			for (const [eventKey, value] of Object.entries(criticalData)) {
				if (
					typeof value !== 'string' ||
					!value.startsWith(DEFERRED_VALUE_PLACEHOLDER_PREFIX)
				) {
					continue
				}

				deferredData = deferredData || {}

				deferredData[eventKey] = new Promise((resolve, reject) => {
					deferredResolvers[eventKey] = {
						resolve: (value: unknown) => {
							resolve(value)
							delete deferredResolvers[eventKey]
						},
						reject: (error: unknown) => {
							reject(error)
							delete deferredResolvers[eventKey]
						},
					}
				})
			}
		}

		// Read the rest of the stream and resolve deferred promises
		void (async () => {
			try {
				for await (const section of sectionReader) {
					// Determine event type and data
					const [event, ...sectionDataStrings] = section.split(':')
					const sectionDataString = sectionDataStrings.join(':')
					const data = JSON.parse(sectionDataString)

					if (event === 'data') {
						for (const [key, value] of Object.entries(data)) {
							if (deferredResolvers[key]) {
								deferredResolvers[key].resolve(value)
							}
						}
					} else if (event === 'error') {
						for (const [key, value] of Object.entries(data) as Iterable<
							[string, { message: string; stack?: string }]
						>) {
							const err = new Error(value.message)
							err.stack = value.stack
							if (deferredResolvers[key]) {
								deferredResolvers[key].reject(err)
							}
						}
					}
				}

				for (const [key, resolver] of Object.entries(deferredResolvers)) {
					resolver.reject(
						new AbortedDeferredError(`Deferred ${key} will never be resolved`),
					)
				}
			} catch (error) {
				// Reject any existing deferred promises if something blows up
				for (const resolver of Object.values(deferredResolvers)) {
					resolver.reject(error)
				}
			}
		})()

		return new DeferredData({ ...criticalData, ...deferredData })
	} catch (error) {
		for (const resolver of Object.values(deferredResolvers)) {
			resolver.reject(error)
		}

		throw error
	}
}

async function* readStreamSections(stream: ReadableStream<Uint8Array>) {
	const reader = stream.getReader()

	let buffer: Uint8Array[] = []
	let sections: string[] = []
	let closed = false
	const encoder = new TextEncoder()
	const decoder = new TextDecoder()

	const readStreamSection = async () => {
		if (sections.length > 0) return sections.shift()

		// Read from the stream until we have at least one complete section to process
		while (!closed && sections.length === 0) {
			const chunk = await reader.read()
			if (chunk.done) {
				closed = true
				break
			}
			// Buffer the raw chunks
			buffer.push(chunk.value)

			try {
				// Attempt to split off a section from the buffer
				const bufferedString = decoder.decode(mergeArrays(...buffer))
				const splitSections = bufferedString.split('\n\n')
				if (splitSections.length >= 2) {
					// We have a complete section, so add it to the sections array
					sections.push(...splitSections.slice(0, -1))
					// Remove the section from the buffer and store the rest for future processing
					buffer = [encoder.encode(splitSections.slice(-1).join('\n\n'))]
				}

				// If we successfully parsed at least one section, break out of reading the stream
				// to allow upstream processing of the processable sections
				if (sections.length > 0) {
					break
				}
			} catch {}
		}

		// If we have a complete section, return it
		if (sections.length > 0) {
			return sections.shift()
		}

		// If we have no complete section, but we have no more chunks to process,
		// split those sections and clear out the buffer as there is no more data
		// to process. If this errors, let it bubble up as the stream ended
		// without valid data
		if (buffer.length > 0) {
			const bufferedString = decoder.decode(mergeArrays(...buffer))
			sections = bufferedString.split('\n\n').filter((s) => s)
			buffer = []
		}

		// Return any remaining sections that have been processed
		return sections.shift()
	}

	let section = await readStreamSection()
	while (section) {
		yield section
		section = await readStreamSection()
	}
}

function mergeArrays(...arrays: Uint8Array[]) {
	const out = new Uint8Array(
		arrays.reduce((total, arr) => total + arr.length, 0),
	)
	let offset = 0
	for (const arr of arrays) {
		out.set(arr, offset)
		offset += arr.length
	}
	return out
}
