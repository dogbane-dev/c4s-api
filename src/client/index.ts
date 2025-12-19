import createClient, { type Client } from 'openapi-fetch'
import {
	remixParseHandler,
	remixRedirectHandler,
	requestRewriteHandler,
} from './middleware'
import type { paths } from './paths.generated'

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
})

client.use(remixParseHandler, remixRedirectHandler, requestRewriteHandler)

export { client }
