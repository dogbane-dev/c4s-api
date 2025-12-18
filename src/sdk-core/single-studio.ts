import { client } from '../client'
import type { paths } from '../client/paths.generated'
import type { Language } from '../shared/utils'
import { DEFAULT_LANGUAGE } from './config'

type GetC4SStudioParams = {
	id: number
	slug?: string
	language?: Language
}

type GetC4SStudioData =
	paths['/{language}/studio/{studioId}/{studioSlug}']['get']['responses']['200']['content']['text/remix-deferred']

const getC4SStudio = async (
	params: GetC4SStudioParams,
): Promise<GetC4SStudioData> => {
	const res = await client.GET('/{language}/studio/{studioId}/{studioSlug}', {
		params: {
			path: {
				studioId: params.id,
				// if slug is not passed in, client will handle making request based on redirect
				studioSlug: params.slug ?? 'x',
				language: params.language ?? DEFAULT_LANGUAGE,
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
