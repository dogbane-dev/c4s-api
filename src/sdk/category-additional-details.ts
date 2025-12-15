import type { SetOptional } from 'type-fest'
import { client } from '../client'
import type { paths } from '../client/paths.generated'
import { DEFAULT_PREFERENCES } from './config'

type GetC4SCategoryAdditionalDetailsParams = SetOptional<
	Omit<paths['/clips/category/seeMore']['get']['parameters']['query'], '_data'>,
	'pill' | 'lng'
>

type GetC4SCategoryAdditionalDetailsData =
	paths['/clips/category/seeMore']['get']['responses']['200']['content']['application/json']

const getC4SCategoryAdditionalDetails = async (
	params: GetC4SCategoryAdditionalDetailsParams,
): Promise<GetC4SCategoryAdditionalDetailsData> => {
	const res = await client.GET('/clips/category/seeMore', {
		params: {
			query: {
				_data: 'routes/clips.category.seeMore',
				...params,
				pill: params.pill ?? DEFAULT_PREFERENCES,
				lng: params.lng ?? 'en',
			},
		},
	})

	if (!res.data) throw new Error('No data')

	return res.data
}

export {
	getC4SCategoryAdditionalDetails,
	type GetC4SCategoryAdditionalDetailsParams,
	type GetC4SCategoryAdditionalDetailsData,
}
