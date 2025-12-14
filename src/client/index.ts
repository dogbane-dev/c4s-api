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
})

client.use(remixParseHandler, remixRedirectHandler, requestRewriteHandler)

export { client }
