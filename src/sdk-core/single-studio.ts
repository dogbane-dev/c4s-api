import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { C4SApiError } from '../client/utils'
import { parseC4SStudioUrl } from '../shared/c4s-url'
import { type C4SLanguage, parseLanguage, parseSlug } from '../shared/utils'

type GetC4SStudioParams = {
	id: number
	slug?: string
	language?: C4SLanguage
}

type GetC4SStudioData =
	paths['/{language}/studio/{studioId}/{studioSlug}']['get']['responses']['200']['content']['text/remix-deferred']

const baseGetC4SStudio = async (
	params: GetC4SStudioParams,
	client?: C4SClient,
): Promise<GetC4SStudioData> => {
	const c = getC4SClient(client)

	const res = await c.GET('/{language}/studio/{studioId}/{studioSlug}', {
		params: {
			path: {
				studioId: params.id,
				studioSlug: parseSlug(params.slug),
				language: parseLanguage(params.language),
			},
			query: {
				_data: 'routes/($lang).studio.$id_.$studioSlug.$',
			},
		},
	})

	// if (res.error) throw new Error(res.error.message);

	if (!res.data) throw new C4SApiError(res.response)

	return res.data
}

const getC4SStudio = async (
	params: GetC4SStudioParams,
): Promise<GetC4SStudioData> => {
	return baseGetC4SStudio(params, getC4SClient())
}

const baseGetC4SStudioByUrl = async (
	url: string,
	client?: C4SClient,
): Promise<GetC4SStudioData> => {
	const parsed = parseC4SStudioUrl(url)
	return baseGetC4SStudio(
		{
			id: parsed.studioId,
			slug: parsed.studioSlug,
			language: parsed.language,
		},
		client,
	)
}

const getC4SStudioByUrl = async (url: string): Promise<GetC4SStudioData> => {
	return baseGetC4SStudioByUrl(url, getC4SClient())
}

export {
	baseGetC4SStudio,
	baseGetC4SStudioByUrl,
	getC4SStudio,
	getC4SStudioByUrl,
	type GetC4SStudioParams,
	type GetC4SStudioData,
}
