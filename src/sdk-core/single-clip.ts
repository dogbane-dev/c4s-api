import { client } from '../client'
import type { paths } from '../client/paths.generated'
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
): Promise<GetC4SClipData> => {
	const res = await client.GET(
		'/{language}/studio/{studioId}/{clipId}/{clipSlug}',
		{
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
		},
	)

	if (res.error) throw new Error(res.error.message)

	if (!res.data) throw new Error('No data')

	return res.data
}

export { getC4SClip, type GetC4SClipParams, type GetC4SClipData }
