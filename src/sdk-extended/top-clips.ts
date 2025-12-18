import {
	type GetC4SCategoryDetailsData,
	getC4SCategoryDetails,
	getC4SCategorySeeMoreTopClips,
} from '../sdk-core'
import {
	type Language,
	type SexualPreference,
	VALID_SEE_MORE_PAGES,
} from '../shared/utils'

type GetC4STopClipsParams = {
	categoryId: number
	language?: Language
	sexualPreferences?: SexualPreference[]
}
type GetC4STopClipsData = Array<
	Omit<
		GetC4SCategoryDetailsData['topClips'][number],
		| 'onSale'
		| 'isSuggestedWishlist'
		| 'queryId'
		| 'discounted_price'
		| 'srcSet'
		| 'previewUrl'
		| 'customPreview'
	>
>

const getC4STopClips = async (
	params: GetC4STopClipsParams,
): Promise<GetC4STopClipsData> => {
	const details = await getC4SCategoryDetails({
		id: params.categoryId,
		language: params.language,
		sexualPreferences: params.sexualPreferences,
	})

	let topClips: GetC4STopClipsData = details.topClips.map((r) => ({
		clipId: r.clipId,
		title: r.title,
		producer: r.producer,
		bannerLink: r.bannerLink,
		description: r.description,
		translations: r.translations,
		categoryId: r.categoryId,
		categoryName: r.categoryName,
		categoryLink: r.categoryLink,
		duration: r.duration,
		suggestedClipUrl: r.suggestedClipUrl,
		previewLink: r.previewLink,
		customPreviewUrl: r.customPreviewUrl,
		studioTitle: r.studioTitle,
		studioLink: r.studioLink,
		price: r.price,
	}))

	for (const page of VALID_SEE_MORE_PAGES) {
		const result = await getC4SCategorySeeMoreTopClips({
			id: params.categoryId,
			page,
			type: 'top-clips',
			language: params.language,
			sexualPreferences: params.sexualPreferences,
		})

		const mapped = result.map((r) => {
			return {
				clipId: r.id,
				title: r.title,
				producer: r.studio.id,
				bannerLink: r.link,
				description: r.description,
				translations: r.translations,
				categoryId: r.category.id,
				categoryName: r.category.name,
				categoryLink: r.category.link,
				duration: r.length,
				suggestedClipUrl: r.suggested_clip_url,
				previewLink: r.thumb,
				customPreviewUrl: r.video_preview_link,
				studioTitle: r.studio.name,
				studioLink: r.studio.link,
				price: r.price,
			}
		})

		topClips = topClips.concat(mapped)
	}

	return topClips
}

export { getC4STopClips, type GetC4STopClipsData, type GetC4STopClipsParams }
