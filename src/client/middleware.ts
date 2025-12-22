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
	fetch: typeof globalThis.fetch,
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
	const newUrl = url.toString()
	const newRequest = new Request(newUrl, request)
	const newResponse = await fetch(newRequest)
	return handleRedirect(schemaPath, newRequest, newResponse, fetch)
}

export const remixRedirectHandler: Middleware = {
	async onResponse({ request, response, schemaPath, options }) {
		return handleRedirect(schemaPath, request, response, options.fetch)
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
		const url = new URL(request.url)

		let pathname = url.pathname

		// handle optional language path param at start of path - "/en/..." - defaults to region in which request is made
		if (schemaPath.startsWith('/{language}/') && pathname.match(/^\/\//)) {
			// language is blank (path name starts with "//")
			// replace "//"
			pathname = pathname.replace(/^\/\//, '/')
		}

		// handle optional search path param - ".../search/search%20term" only needed if search term is passed in
		if (
			schemaPath.endsWith('/search/{search}') &&
			pathname.match(/\/search\/$/)
		) {
			// search is blank
			// remove "/search/{search}"
			pathname = pathname.replace(/\/search\/$/, '')
		}

		if (
			schemaPath ===
			'/{language}/clips/search/{search}/category/{category}/storesPage/{storePage}/clipsPage/{page}/sortstudios/{studioSort}/sortclips/{clipSort}/sortcategories/{categorySort}/filters/{filters}'
		) {
			// no search, fix "//"
			if (pathname.match(/^\/clips\/search\/\//)) {
				pathname = pathname.replace(/^\/clips\/search\/\//, '/clips/search/')
			}
			// no filters
			if (pathname.match(/\/filters\/$/)) {
				// remove ".../filters/"
				pathname = pathname.replace(/\/filters\/$/, '')
			}
			// all default sorts - remove sorts substring
			if (
				pathname.match(
					/\/sortstudios\/bestmatch\/sortclips\/bestmatch\/sortcategories\/bestmatch$/,
				)
			) {
				pathname = pathname.replace(
					/\/sortstudios\/bestmatch\/sortclips\/bestmatch\/sortcategories\/bestmatch$/,
					'',
				)
			}
		}

		// pathname was not changed, return to just continue with original request
		if (url.pathname === pathname) {
			return
		}

		// update pathname and return new request
		url.pathname = pathname
		// console.log('Rewriting', '\n', request.url, '\n', url.toString())
		return new Request(url.toString(), request)
	},
}
