import createClient, { type Client } from 'openapi-fetch'
import type { paths } from '../open-api/paths.generated'
import { remixParseHandler, remixRedirectHandler } from './middleware'

const client: Client<paths, `${string}/${string}`> = createClient<paths>({
	baseUrl: 'https://www.clips4sale.com',
	headers: {
		Cookie: 'ageVerified=true;',
	},
})

client.use(remixParseHandler, remixRedirectHandler)

export { client }
