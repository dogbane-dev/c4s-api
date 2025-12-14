import type { SetOptional } from 'type-fest'
import { client } from '../client'
import type { paths } from '../open-api/paths.generated'

type GetC4SStudioClipsParams = SetOptional<
	paths['/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}']['get']['parameters']['path'],
	'studioSlug' | 'language' | 'category' | 'sort' | 'search'
> &
	Omit<
		paths['/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}']['get']['parameters']['query'],
		'_data' | 'onlyClips'
	> & { onlyClips?: boolean }

type GetC4SStudioClipsData =
	paths['/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}']['get']['responses']['200']['content']['application/json']

const getC4SStudioClips = async (
	params: GetC4SStudioClipsParams,
): Promise<GetC4SStudioClipsData> => {
	const defaultParams = {
		// 0 = all categories
		category: 0,
		sort: 'recommended',
		// if slug is not passed in, client will handle the remix redirect
		studioSlug: 'x',
		language: 'en',
		// if search is not passed in, empty string will equate to no search
		search: '',
	} satisfies Partial<GetC4SStudioClipsParams>

	const { onlyClips, ...pathParams } = { ...defaultParams, ...params }

	const res = await client.GET(
		'/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}',
		{
			params: {
				path: {
					...defaultParams,
					...pathParams,
				},
				query: {
					_data: 'routes/($lang).studio.$id_.$studioSlug.$',
					...(onlyClips && { onlyClips: 'true' }),
				},
			},
		},
	)

	if (!res.data) throw new Error(res.response.statusText)

	return res.data
}

export {
	getC4SStudioClips,
	type GetC4SStudioClipsParams,
	type GetC4SStudioClipsData,
}
