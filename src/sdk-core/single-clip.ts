import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { C4SApiError } from '../client/utils'
import { parseC4SClipUrl } from '../shared/c4s-url'
import {
	type C4SLanguage,
	parseLanguage,
	parseSlug,
	parseStudioId,
} from '../shared/utils'

type GetC4SClipParams = {
	id: number
	studioId?: number
	slug?: string
	language?: C4SLanguage
}

type GetC4SClipData =
	paths['/{language}/studio/{studioId}/{clipId}/{clipSlug}']['get']['responses']['200']['content']['text/remix-deferred']

const baseGetC4SClip = async (
	params: GetC4SClipParams,
	client?: C4SClient,
): Promise<GetC4SClipData> => {
	const c = getC4SClient(client)

	const res = await c.GET('/{language}/studio/{studioId}/{clipId}/{clipSlug}', {
		params: {
			path: {
				clipId: params.id,
				studioId: parseStudioId(params.studioId),
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

const getC4SClip = async (
	params: GetC4SClipParams,
): Promise<GetC4SClipData> => {
	return baseGetC4SClip(params, getC4SClient())
}

const baseGetC4SClipByUrl = async (
	url: string,
	client?: C4SClient,
): Promise<GetC4SClipData> => {
	const parsed = parseC4SClipUrl(url)
	return baseGetC4SClip(
		{
			...parsed,
			id: parsed.clipId,
		},
		client,
	)
}

const getC4SClipByUrl = async (url: string): Promise<GetC4SClipData> => {
	return baseGetC4SClipByUrl(url, getC4SClient())
}

const baseGetC4SClipById = async (
	id: number,
	additionalParams?: Omit<GetC4SClipParams, 'id'>,
	client?: C4SClient,
): Promise<GetC4SClipData> => {
	return baseGetC4SClip(
		{
			...additionalParams,
			id,
		},
		client,
	)
}

const getC4SClipById = async (
	id: number,
	additionalParams?: Omit<GetC4SClipParams, 'id'>,
): Promise<GetC4SClipData> => {
	return baseGetC4SClipById(id, additionalParams, getC4SClient())
}

export {
	baseGetC4SClip,
	baseGetC4SClipById,
	baseGetC4SClipByUrl,
	getC4SClip,
	getC4SClipById,
	getC4SClipByUrl,
	type GetC4SClipParams,
	type GetC4SClipData,
}
