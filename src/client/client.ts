import createClient, { type Client, type ClientOptions } from 'openapi-fetch'
import {
	remixParseHandler,
	remixRedirectHandler,
	requestRewriteHandler,
} from './middleware'
import type { paths } from './paths.generated'

type C4SClient<P extends {} = paths> = Client<P>

/**
 * Creates an OpenAPI fetch client configured for Clips4Sale requests.
 *
 * @param ops - Optional client options. Pass a custom `fetch` implementation for
 * testing, retries, proxies, or custom request handling.
 * @returns A configured OpenAPI client with Clips4Sale base URL, headers,
 * query serialization, Remix parsing, redirect handling, and request rewrites.
 */
const createC4SClient = <P extends {} = paths>(
	ops?: Pick<ClientOptions, 'fetch'>,
): C4SClient<P> => {
	const client = createClient<P>({
		baseUrl: 'https://www.clips4sale.com',
		headers: {
			Cookie: 'ageVerified=true;',
		},
		querySerializer: (queryParams) => {
			const search: string[] = []
			for (const name in queryParams) {
				const value = queryParams[name]
				if (Array.isArray(value)) {
					search.push(
						`${name}=${value.map((v) => encodeURIComponent(`${v}`)).join('_')}`,
					)
				} else if (typeof value !== 'undefined') {
					search.push(`${name}=${encodeURIComponent(`${value}`)}`)
				}
			}
			return search.join('&')
		},
		...ops,
	})

	client.use(remixParseHandler, remixRedirectHandler, requestRewriteHandler)

	return client
}

const clientSingleton = createC4SClient()

/**
 * Returns the provided Clips4Sale client or the library-wide singleton client.
 *
 * @param optionalClient - Client to use instead of the singleton.
 * @returns A Clips4Sale OpenAPI client.
 */
function getC4SClient(optionalClient?: C4SClient): C4SClient {
	return optionalClient ?? clientSingleton
}

export { getC4SClient, createC4SClient, type C4SClient }
