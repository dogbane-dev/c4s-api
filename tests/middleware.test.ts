import { afterEach, describe, expect, it, mock } from 'bun:test'
import { createC4SClient } from '../src/client/client'

const NativeResponse = globalThis.Response

afterEach(() => {
	globalThis.Response = NativeResponse
})

const replaceResponseConstructor = () => {
	globalThis.Response = class Response extends NativeResponse {}
}

describe('Remix redirect middleware', () => {
	it('passes through responses created by another Response constructor', async () => {
		const response = new NativeResponse(JSON.stringify({ success: true }), {
			headers: { 'content-type': 'application/json' },
		})
		const fetch = mock(async () => response)
		const client = createC4SClient({ fetch })

		replaceResponseConstructor()

		const result = await client.GET('/clips/ajax/categoriesdropdown')

		expect(result.response).toBe(response)
		expect(result.data).toEqual({ success: true })
	})

	it('normalizes a response after following a Remix redirect', async () => {
		const redirectResponse = new NativeResponse(null, {
			headers: {
				'x-remix-redirect': '/clips/ajax/categoriesdropdown',
				'x-remix-status': '302',
			},
		})
		const finalResponse = new NativeResponse(
			JSON.stringify({ success: true }),
			{
				headers: { 'content-type': 'application/json' },
			},
		)
		const responses = [redirectResponse, finalResponse]
		const fetch = mock(async () => {
			const response = responses.shift()
			if (!response) {
				throw new Error('Unexpected request')
			}
			return response
		})
		const client = createC4SClient({ fetch })

		replaceResponseConstructor()

		const result = await client.GET('/clips/ajax/categoriesdropdown')

		expect(fetch).toHaveBeenCalledTimes(2)
		expect(result.response).toBeInstanceOf(globalThis.Response)
		expect(result.data).toEqual({ success: true })
	})
})
