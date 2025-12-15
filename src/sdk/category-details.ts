import type { SetOptional } from 'type-fest'
import { client } from '../client'
import type { paths } from '../client/paths.generated'
import { DEFAULT_PREFERENCES } from './config'

type GetC4SCategoryDetailsParams = SetOptional<
	paths['/{language}/clips/category/{category}']['get']['parameters']['path'],
	'language'
> &
	SetOptional<
		Omit<
			paths['/{language}/clips/category/{category}']['get']['parameters']['query'],
			'_data'
		>,
		'pill'
	>

type GetC4SCategoryDetailsData =
	paths['/{language}/clips/category/{category}']['get']['responses']['200']['content']['application/json']

const getC4SCategoryDetails = async (
	params: GetC4SCategoryDetailsParams,
): Promise<GetC4SCategoryDetailsData> => {
	const { pill, ...pathParams } = params

	const res = await client.GET('/{language}/clips/category/{category}', {
		params: {
			path: {
				...pathParams,
				language: pathParams.language ?? 'en',
			},
			query: {
				_data: 'routes/($lang).clips.category.$id.($catName)',
				pill: pill ?? DEFAULT_PREFERENCES,
			},
		},
	})

	if (!res.data) throw new Error('No data')

	return res.data
}

export {
	getC4SCategoryDetails,
	type GetC4SCategoryDetailsParams,
	type GetC4SCategoryDetailsData,
}
