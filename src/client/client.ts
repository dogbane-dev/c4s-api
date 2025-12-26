import createClient, { type Client, type ClientOptions } from 'openapi-fetch'
import {
	remixParseHandler,
	remixRedirectHandler,
	requestRewriteHandler,
} from './middleware'
import type { paths } from './paths.generated'

type C4SClient<P extends {} = paths> = Client<P>
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
function getC4SClient(optionalClient?: C4SClient): C4SClient {
	return optionalClient ?? clientSingleton
}

export { getC4SClient, createC4SClient, type C4SClient }
