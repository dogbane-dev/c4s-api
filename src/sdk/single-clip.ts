import type { SetOptional } from 'type-fest'
import { client } from '../client'
import type { paths } from '../open-api/paths.generated'

type GetC4SClipParams = SetOptional<
	paths['/{language}/studio/{studioId}/{clipId}/{clipSlug}']['get']['parameters']['path'],
	'clipSlug' | 'language'
>

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
					...params,
					// if slug is not passed in, client will handle making request based on redirect
					clipSlug: params.clipSlug ?? 'x',
					language: params.language ?? 'en',
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
