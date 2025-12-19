import { client } from '../client'
import type { paths } from '../client/paths.generated'
import {
	type Language,
	parseLanguage,
	parseSexualPreferences,
	type SexualPreference,
} from '../shared/utils'

type GetC4SCategoryDetailsParams = {
	id: number
	language?: Language
	sexualPreferences?: SexualPreference[]
}

type GetC4SCategoryDetailsData =
	paths['/{language}/clips/category/{category}']['get']['responses']['200']['content']['application/json']

const getC4SCategoryDetails = async (
	params: GetC4SCategoryDetailsParams,
): Promise<GetC4SCategoryDetailsData> => {
	const res = await client.GET('/{language}/clips/category/{category}', {
		params: {
			path: {
				category: params.id,
				language: parseLanguage(params.language),
			},
			query: {
				_data: 'routes/($lang).clips.category.$id.($catName)',
				pill: parseSexualPreferences(params.sexualPreferences),
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
