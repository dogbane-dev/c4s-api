import type { SetOptional } from 'type-fest'
import { client } from '../client'
import type { paths } from '../open-api/paths.generated'

type GetC4SStudioParams = SetOptional<
	paths['/{language}/studio/{studioId}/{studioSlug}']['get']['parameters']['path'],
	'studioSlug' | 'language'
>

type GetC4SStudioData =
	paths['/{language}/studio/{studioId}/{studioSlug}']['get']['responses']['200']['content']['text/remix-deferred']

const getC4SStudio = async (
	params: GetC4SStudioParams,
): Promise<GetC4SStudioData> => {
	const res = await client.GET('/{language}/studio/{studioId}/{studioSlug}', {
		params: {
			path: {
				...params,
				// if slug is not passed in, client will handle making request based on redirect
				studioSlug: params.studioSlug ?? 'x',
				language: params.language ?? 'en',
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
