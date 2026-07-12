import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { C4SApiError } from '../client/utils'
import {
	type C4SLanguage,
	type InferFromField,
	parseSexualPreferences,
	type SexualPreference,
} from '../shared/utils'

type GetC4SCategorySeeMoreParams = {
	type: 'top-stores' | 'top-clips' | 'recently-added-related-clips'
	language?: C4SLanguage
	id: number
	sexualPreferences?: SexualPreference[]
	page: number
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

const baseGetC4SCategorySeeMore = async (
	params: GetC4SCategorySeeMoreParams,
	client?: C4SClient,
): Promise<GetC4SCategorySeeMoreData> => {
	const c = getC4SClient(client)
	const res = await c.GET('/clips/category/seeMore', {
		params: {
			query: {
				_data: 'routes/clips.category.seeMore',
				pill: parseSexualPreferences(params.sexualPreferences),
				lng: params.language,
				id: params.id,
				page: params.page,
				section: `${params.type}-see-more`,
			},
		},
	})

	if (!res.data) throw new C4SApiError(res.response)

	return res.data
}

const getC4SCategorySeeMore = async (
	params: GetC4SCategorySeeMoreParams,
): Promise<GetC4SCategorySeeMoreData> => {
	return baseGetC4SCategorySeeMore(params, getC4SClient())
}

const baseGetC4SCategorySeeMoreTopStores = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
	client?: C4SClient,
): Promise<GetC4SCategorySeeMoreStudio[]> => {
	const res = await baseGetC4SCategorySeeMore(
		{
			...params,
			type: 'top-stores',
		},
		client,
	)
	return res.seeMoreExtra as GetC4SCategorySeeMoreStudio[]
}

const getC4SCategorySeeMoreTopStores = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
): Promise<GetC4SCategorySeeMoreStudio[]> => {
	return baseGetC4SCategorySeeMoreTopStores(params, getC4SClient())
}

const baseGetC4SCategorySeeMoreTopClips = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
	client?: C4SClient,
): Promise<GetC4SCategorySeeMoreClip[]> => {
	const res = await baseGetC4SCategorySeeMore(
		{
			...params,
			type: 'top-clips',
		},
		client,
	)
	return res.seeMoreExtra as GetC4SCategorySeeMoreClip[]
}

const getC4SCategorySeeMoreTopClips = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
): Promise<GetC4SCategorySeeMoreClip[]> => {
	return baseGetC4SCategorySeeMoreTopClips(params, getC4SClient())
}

const baseGetC4SCategorySeeMoreRecentlyAddedRelatedClips = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
	client?: C4SClient,
): Promise<GetC4SCategorySeeMoreClip[]> => {
	const res = await baseGetC4SCategorySeeMore(
		{
			...params,
			type: 'recently-added-related-clips',
		},
		client,
	)
	return res.seeMoreExtra as GetC4SCategorySeeMoreClip[]
}

const getC4SCategorySeeMoreRecentlyAddedRelatedClips = async (
	params: Omit<GetC4SCategorySeeMoreParams, 'type'>,
): Promise<GetC4SCategorySeeMoreClip[]> => {
	return baseGetC4SCategorySeeMoreRecentlyAddedRelatedClips(
		params,
		getC4SClient(),
	)
}

export {
	baseGetC4SCategorySeeMore,
	baseGetC4SCategorySeeMoreTopStores,
	baseGetC4SCategorySeeMoreTopClips,
	baseGetC4SCategorySeeMoreRecentlyAddedRelatedClips,
	getC4SCategorySeeMore,
	getC4SCategorySeeMoreTopStores,
	getC4SCategorySeeMoreTopClips,
	getC4SCategorySeeMoreRecentlyAddedRelatedClips,
	type GetC4SCategorySeeMoreParams,
	type GetC4SCategorySeeMoreData,
	type GetC4SCategorySeeMoreClip,
	type GetC4SCategorySeeMoreStudio,
}
