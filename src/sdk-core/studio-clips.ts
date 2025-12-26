import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import {
	type Language,
	parseLanguage,
	parseSlug,
	parseStudioSearchSort,
	type StudioSearchSortParam,
} from '../shared/utils'

type GetC4SStudioClipsParams = {
	id: number
	slug?: string
	page?: number
	categoryId?: number
	sort?: StudioSearchSortParam
	search?: string
	onlyClips?: boolean
	language?: Language
}

type GetC4SStudioClipsData =
	paths['/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}']['get']['responses']['200']['content']['application/json']

const getC4SStudioClips = async (
	params: GetC4SStudioClipsParams,
	client?: C4SClient,
): Promise<GetC4SStudioClipsData> => {
	const c = getC4SClient(client)

	const res = await c.GET(
		'/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}',
		{
			params: {
				path: {
					studioId: params.id,
					// if slug is not passed in, client will handle the remix redirect
					studioSlug: parseSlug(params.slug),
					category: params.categoryId ?? 0,
					page: params.page ?? 1,
					search: params.search ?? '',
					sort: parseStudioSearchSort(params.sort),
					language: parseLanguage(params.language),
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
