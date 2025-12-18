import { client } from '../client'
import type { paths } from '../client/paths.generated'
import type { Language, StudioSearchSort } from '../shared/utils'
import { DEFAULT_LANGUAGE } from './config'

type GetC4SStudioClipsParams = {
	id: number
	slug?: string
	page?: number
	categoryId?: number
	sort?: StudioSearchSort
	search?: string
	onlyClips?: boolean
	language?: Language
}

type GetC4SStudioClipsData =
	paths['/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}']['get']['responses']['200']['content']['application/json']

const getC4SStudioClips = async (
	params: GetC4SStudioClipsParams,
): Promise<GetC4SStudioClipsData> => {
	const res = await client.GET(
		'/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}',
		{
			params: {
				path: {
					studioId: params.id,
					// if slug is not passed in, client will handle the remix redirect
					studioSlug: params.slug ?? 'x',
					category: params.categoryId ?? 0,
					page: params.page ?? 1,
					search: params.search ?? '',
					sort: params.sort ?? 'recommended',
					language: params.language ?? DEFAULT_LANGUAGE,
				},
				query: {
					_data: 'routes/($lang).studio.$id_.$studioSlug.$',
					...(params.onlyClips && { onlyClips: 'true' }),
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
