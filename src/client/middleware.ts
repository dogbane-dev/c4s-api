import type { Middleware } from 'openapi-fetch'
import {
	C4SClipNotFoundError,
	C4SStudioNotFoundError,
	parseRemixBody,
} from './utils'

export const remixRedirectHandler: Middleware = {
	async onResponse({ request, response, schemaPath }) {
		const remixRedirect = response.headers.get('x-remix-redirect')
		const remixStatus = response.headers.get('x-remix-status')

		if (remixStatus === '302' && remixRedirect) {
			if (schemaPath === '/{language}/studio/{studioId}/{clipId}/{clipSlug}') {
				// trying to redirect to home so studio was not found at all
				if (remixRedirect === '/') {
					throw new C4SStudioNotFoundError()
				}
				// trying to redirect to a studio so the clip was not found but studio was
				if (remixRedirect.match(/^\/studio\/\d+$/)) {
					throw new C4SClipNotFoundError()
				}
			}
			if (schemaPath === '/{language}/studio/{studioId}/{studioSlug}') {
				if (remixRedirect === '/') {
					throw new C4SStudioNotFoundError()
				}
			}

			const url = new URL(request.url)
			url.pathname = remixRedirect
			const newResponse = await fetch(new Request(url.toString(), request))
			return newResponse
		}
	},
}

export const remixParseHandler: Middleware = {
	async onResponse({ response }) {
		if (!response.body) return

		const contentType = response.headers.get('content-type')

		if (contentType?.startsWith('text/remix-deferred;')) {
			const newBody = await parseRemixBody(response.body)
			return new Response(JSON.stringify(newBody), response)
		}
	},
}
