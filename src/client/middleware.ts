import type { Middleware } from 'openapi-fetch'
import {
	C4SClipNotFoundError,
	C4SStudioNotFoundError,
	parseRemixBody,
} from './utils'

// recursively follow redirects
const handleRedirect = async (
	schemaPath: string,
	request: Request,
	response: Response,
) => {
	const remixRedirect = response.headers.get('x-remix-redirect')
	const remixStatus = response.headers.get('x-remix-status')

	const redirectStatues = ['302', '301']

	// base case - no redirect
	if (
		!remixRedirect ||
		!remixStatus ||
		!redirectStatues.includes(remixStatus)
	) {
		return response
	}

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
	const newRequest = new Request(url.toString(), request)
	const newResponse = await fetch(newRequest)
	return handleRedirect(schemaPath, newRequest, newResponse)
}

export const remixRedirectHandler: Middleware = {
	async onResponse({ request, response, schemaPath }) {
		return handleRedirect(schemaPath, request, response)
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

export const requestRewriteHandler: Middleware = {
	async onRequest({ request, schemaPath }) {
		// handle optional language path param at start of path - "/en/..." - defaults to region in which request is made
		if (schemaPath.startsWith('/{language}/')) {
			const url = new URL(request.url)
			// language is blank (path name starts with "//")
			if (url.pathname.match(/^\/\//)) {
				url.pathname = url.pathname.replace(/^\/\//, '/')
				return new Request(url.toString(), request)
			}
		}

		// handle optional search path param - ".../search/search%20term" only needed if search term is passed in
		if (schemaPath.endsWith('/search/{search}')) {
			const url = new URL(request.url)
			// search is blank
			if (url.pathname.match(/\/search\/$/)) {
				// remove "/search/{search}"
				url.pathname = url.pathname.replace(/\/search\/$/, '')
				return new Request(url.toString(), request)
			}
		}
	},
}
