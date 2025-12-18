import {
	type GetC4SStudioClipsData,
	type GetC4SStudioClipsParams,
	getC4SStudioClips,
} from '../sdk-core'
import { STUDIO_CLIPS_PER_PAGE } from '../shared/utils'

type GetC4SAllStudioClipsParams = Omit<
	GetC4SStudioClipsParams,
	'onlyClips' | 'page'
> & {
	onPage?: (
		clips: GetC4SStudioClipsData['clips'],
		page: number,
	) => void | Promise<void>
}
type GetC4SAllStudioClipsData = GetC4SStudioClipsData['clips']

const getC4SAllStudioClips = async (
	params: GetC4SAllStudioClipsParams,
): Promise<GetC4SAllStudioClipsData> => {
	let totalPages: number
	let page = 1

	const results = [] as Array<GetC4SStudioClipsData['clips']>

	do {
		const s = await getC4SStudioClips({
			...params,
			onlyClips: true,
			page,
		})

		if (typeof s.clipsCount !== 'number') {
			throw new Error('clip count not found')
		}
		totalPages = Math.ceil(s.clipsCount / STUDIO_CLIPS_PER_PAGE)

		results.push(s.clips)
		await params.onPage?.(s.clips, page)
		page += 1
	} while (page <= totalPages)

	return results.flat()
}

export {
	getC4SAllStudioClips,
	type GetC4SAllStudioClipsParams,
	type GetC4SAllStudioClipsData,
}

// TODO
// make sure totalPage is correct if a category or search is present
