import createClient, { type Client, type ClientOptions } from 'openapi-fetch'
import {
	remixParseHandler,
	remixRedirectHandler,
	requestRewriteHandler,
} from './middleware'
import type { paths } from './paths.generated'

type C4SClient = Client<paths>
const createC4SClient = (ops?: Pick<ClientOptions, 'fetch'>): C4SClient => {
	const client: Client<paths> = createClient<paths>({
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
function getClient(optionalClient?: C4SClient): C4SClient {
	return optionalClient ?? clientSingleton
}

export { getClient, createC4SClient, type C4SClient }
