import createClient, { type Client } from 'openapi-fetch'
import type { paths } from '../open-api/paths.generated'
import {
	remixParseHandler,
	remixRedirectHandler,
	requestRewriteHandler,
} from './middleware'

const client: Client<paths, `${string}/${string}`> = createClient<paths>({
	baseUrl: 'https://www.clips4sale.com',
	headers: {
		// Referer: 'https://www.clips4sale.com',
		Cookie: 'ageVerified=true;',
	},
	querySerializer: (queryParams) => {
		const search = [] as string[]
		for (const name in queryParams) {
			const value = queryParams[name]
			if (Array.isArray(value)) {
				search.push(
					`${name}=${value.map((v) => encodeURIComponent(`${v}`)).join('_')}`,
				)
			} else {
				search.push(`${name}=${encodeURIComponent(`${value}`)}`)
			}
		}
		return search.join('&')
	},
})

client.use(remixParseHandler, remixRedirectHandler, requestRewriteHandler)

export { client }
