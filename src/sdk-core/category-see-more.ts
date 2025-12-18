import { client } from '../client'
import type { paths } from '../client/paths.generated'
import {
	type InferFromField,
	type Language,
	parseSexualPreferences,
	type SexualPreference,
} from '../shared/utils'
import { DEFAULT_LANGUAGE, DEFAULT_SEXUAL_PREFERENCES } from './config'

type GetC4SCategorySeeMoreParams = {
	type: 'top-stores' | 'top-clips' | 'recently-added-related-clips'
	language?: Language
	id: number
	sexualPreferences?: SexualPreference[]
	page?: number
}

type GetC4SCategorySeeMoreData =
	paths['/clips/category/seeMore']['get']['responses']['200']['content']['application/json']

type GetC4SCategorySeeMoreClip = InferFromField<
	'title',
	GetC4SCategorySeeMoreData['seeMoreExtra'][number]
>
type GetC4SCategorySeeMoreStudio = InferFromField<
	'name',
	GetC4SCategorySeeMoreData['seeMoreExtra'][number]
>

const getC4SCategorySeeMore = async (
	params: GetC4SCategorySeeMoreParams,
): Promise<GetC4SCategorySeeMoreData> => {
	const res = await client.GET('/clips/category/seeMore', {
		params: {
			query: {
				_data: 'routes/clips.category.seeMore',
				pill: params.sexualPreferences
					? parseSexualPreferences(params.sexualPreferences)
					: DEFAULT_SEXUAL_PREFERENCES,
				lng: params.language ?? DEFAULT_LANGUAGE,
				id: params.id,
				page: params.page ?? 2,
				section: `${params.type}-see-more`,
			},
		},
	})

	if (!res.data) throw new Error('No data')

	return res.data
}

const getC4SCategorySeeMoreTopStores = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
): Promise<GetC4SCategorySeeMoreStudio[]> => {
	const res = await getC4SCategorySeeMore({
		...params,
		type: 'top-stores',
	})
	return res.seeMoreExtra as GetC4SCategorySeeMoreStudio[]
}

const getC4SCategorySeeMoreTopClips = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'section'>,
): Promise<GetC4SCategorySeeMoreClip[]> => {
	const res = await getC4SCategorySeeMore({
		...params,
		type: 'top-clips',
	})
	return res.seeMoreExtra as GetC4SCategorySeeMoreClip[]
}

const getC4SCategorySeeMoreRecentlyAddedRelatedClips = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'section'>,
): Promise<GetC4SCategorySeeMoreClip[]> => {
	const res = await getC4SCategorySeeMore({
		...params,
		type: 'recently-added-related-clips',
	})
	return res.seeMoreExtra as GetC4SCategorySeeMoreClip[]
}

export {
	getC4SCategorySeeMore,
	getC4SCategorySeeMoreTopStores,
	getC4SCategorySeeMoreTopClips,
	getC4SCategorySeeMoreRecentlyAddedRelatedClips,
	type GetC4SCategorySeeMoreParams,
	type GetC4SCategorySeeMoreData,
	type GetC4SCategorySeeMoreClip,
	type GetC4SCategorySeeMoreStudio,
}
