import { type C4SClient, getClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { type Language, parseLanguage, parseSlug } from '../shared/utils'

type GetC4SStudioParams = {
	id: number
	slug?: string
	language?: Language
}

type GetC4SStudioData =
	paths['/{language}/studio/{studioId}/{studioSlug}']['get']['responses']['200']['content']['text/remix-deferred']

const getC4SStudio = async (
	params: GetC4SStudioParams,
	client?: C4SClient,
): Promise<GetC4SStudioData> => {
	const c = getClient(client)

	const res = await c.GET('/{language}/studio/{studioId}/{studioSlug}', {
		params: {
			path: {
				studioId: params.id,
				studioSlug: parseSlug(params.slug),
				language: parseLanguage(params.language),
			},
			query: {
				_data: 'routes/($lang).studio.$id_.$studioSlug.$',
			},
		},
	})

	// if (res.error) throw new Error(res.error.message);

	if (!res.data) throw new Error('No data')

	return res.data
}

export { getC4SStudio, type GetC4SStudioParams, type GetC4SStudioData }
