import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { C4SApiError } from '../client/utils'
import {
	type C4SLanguage,
	parseLanguage,
	parseSexualPreferences,
	type SexualPreference,
} from '../shared/utils'

type GetC4SCategoryDetailsParams = {
	id: number
	language?: C4SLanguage
	sexualPreferences?: SexualPreference[]
}

type GetC4SCategoryDetailsData =
	paths['/{language}/clips/category/{category}']['get']['responses']['200']['content']['application/json']

const baseGetC4SCategoryDetails = async (
	params: GetC4SCategoryDetailsParams,
	client?: C4SClient,
): Promise<GetC4SCategoryDetailsData> => {
	const c = getC4SClient(client)
	const res = await c.GET('/{language}/clips/category/{category}', {
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

	if (!res.data) throw new C4SApiError(res.response)

	return res.data
}

/**
 * Fetches the detail page data for a Clips4Sale category.
 *
 * @param params - Category request options, including category ID, optional
 * language, and optional sexual preference filters.
 * @returns Category page data such as metadata, top clips, top stores, and
 * related sections.
 */
const getC4SCategoryDetails = async (
	params: GetC4SCategoryDetailsParams,
): Promise<GetC4SCategoryDetailsData> => {
	return baseGetC4SCategoryDetails(params, getC4SClient())
}

export {
	baseGetC4SCategoryDetails,
	getC4SCategoryDetails,
	type GetC4SCategoryDetailsParams,
	type GetC4SCategoryDetailsData,
}
