import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { C4SApiError } from '../client/utils'
import { parseC4SClipUrl } from '../shared/c4s-url'
import { type Language, parseLanguage, parseSlug } from '../shared/utils'

type GetC4SClipParams = {
	id: number
	studioId: number
	slug?: string
	language?: Language
}

type GetC4SClipData =
	paths['/{language}/studio/{studioId}/{clipId}/{clipSlug}']['get']['responses']['200']['content']['text/remix-deferred']

const getC4SClip = async (
	params: GetC4SClipParams,
	client?: C4SClient,
): Promise<GetC4SClipData> => {
	const c = getC4SClient(client)

	const res = await c.GET('/{language}/studio/{studioId}/{clipId}/{clipSlug}', {
		params: {
			path: {
				clipId: params.id,
				studioId: params.studioId,
				clipSlug: parseSlug(params.slug),
				language: parseLanguage(params.language),
			},
			query: {
				_data: 'routes/($lang).studio.$id_.$clipId.$clipSlug',
			},
		},
	})

	if (res.error) throw new C4SApiError(res.error.message)

	if (!res.data) throw new C4SApiError(res.response)

	return res.data
}

const getC4SClipByUrl = async (
	url: string,
	client?: C4SClient,
): Promise<GetC4SClipData> => {
	const parsed = parseC4SClipUrl(url)
	return getC4SClip(
		{
			id: parsed.clipId,
			studioId: parsed.studioId,
			slug: parsed.clipSlug,
			language: parsed.language,
		},
		client,
	)
}

export {
	getC4SClip,
	getC4SClipByUrl,
	type GetC4SClipParams,
	type GetC4SClipData,
}
