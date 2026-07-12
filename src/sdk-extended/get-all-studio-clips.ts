import type { MaybePromise } from 'bun'
import {
	type GetC4SStudioClipsData,
	type GetC4SStudioClipsParams,
	getC4SStudioClips,
} from '../sdk-core'

// biome-ignore lint/suspicious/noConfusingVoidType: void needs to be possible
type ShouldSkip = MaybePromise<boolean | undefined | void>

type GetC4SAllStudioClipsParams = Omit<
	GetC4SStudioClipsParams,
	'onlyClips' | 'page'
> & {
	onPage?: (
		accumulatedClips: GetC4SStudioClipsData['clips'],
		currentPage: GetC4SStudioClipsData['clips'],
		page: number,
	) => ShouldSkip
}
type GetC4SAllStudioClipsData = GetC4SStudioClipsData['clips']

/**
 * Fetches every available clip page for a Clips4Sale studio and combines them.
 *
 * @param params - Studio clip query options excluding page and `onlyClips`.
 * Pass `onPage` to inspect accumulated results and stop pagination early.
 * @returns A flat array of all fetched studio clip entries.
 */
const getC4SAllStudioClips = async (
	params: GetC4SAllStudioClipsParams,
): Promise<GetC4SAllStudioClipsData> => {
	let page = 1
	let results = [] as GetC4SStudioClipsData['clips']

	while (true) {
		const s = await getC4SStudioClips({
			...params,
			onlyClips: true,
			page,
		})
		if (s.clips.length === 0) break

		results = results.concat(s.clips)
		if (params.onPage) {
			const shouldSkip = await params.onPage(results, s.clips, page)
			if (shouldSkip) {
				break
			}
		}

		page += 1
	}

	return results.flat()
}

export {
	getC4SAllStudioClips,
	type GetC4SAllStudioClipsParams,
	type GetC4SAllStudioClipsData,
}
