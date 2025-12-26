import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import {
	type ClipSearchFilter,
	type ClipSearchSortParam,
	type Language,
	parseClipSearchFilters,
	parseClipSearchSort,
	parseLanguage,
} from '../shared/utils'

type SearchC4SClipsParams = {
	search?: string
	language?: Language
	filter?: ClipSearchFilter
	page?: number
	sort?: ClipSearchSortParam
}

type SearchC4SClipsData =
	paths['/{language}/clips/search/{search}/category/{category}/storesPage/{storePage}/clipsPage/{page}/sortstudios/{studioSort}/sortclips/{clipSort}/sortcategories/{categorySort}/filters/{filters}']['get']['responses']['200']['content']['application/json']

const searchC4SClips = async (
	params: SearchC4SClipsParams,
	client?: C4SClient,
): Promise<SearchC4SClipsData> => {
	const c = getC4SClient(client)

	const res = await c.GET(
		'/{language}/clips/search/{search}/category/{category}/storesPage/{storePage}/clipsPage/{page}/sortstudios/{studioSort}/sortclips/{clipSort}/sortcategories/{categorySort}/filters/{filters}',
		{
			params: {
				path: {
					language: parseLanguage(params.language),
					search: params.search ?? '',
					clipSort: parseClipSearchSort(params.sort),
					filters: parseClipSearchFilters(params.filter),
					page: params.page ?? 1,
					// all hardcoded / unsure of effect
					category: 0, // really parsed from filters
					storePage: 1,
					categorySort: 'bestmatch',
					studioSort: 'bestmatch',
				},
				query: {
					_data: 'routes/($lang).clips.search.$',
				},
			},
		},
	)

	if (!res.data) throw new Error(res.response.statusText)

	return res.data
}

export { searchC4SClips, type SearchC4SClipsData, type SearchC4SClipsParams }
