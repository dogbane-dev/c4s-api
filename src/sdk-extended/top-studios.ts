import {
	type GetC4SCategoryDetailsData,
	getC4SCategoryDetails,
	getC4SCategorySeeMoreTopStores,
} from '../sdk-core'
import {
	type Language,
	type SexualPreference,
	VALID_SEE_MORE_PAGES,
} from '../shared/utils'

type GetC4STopStudiosParams = {
	categoryId: number
	language?: Language
	sexualPreferences?: SexualPreference[]
}
type GetC4STopStudiosData = Array<
	GetC4SCategoryDetailsData['topStores'][number]
>

const getC4STopStudios = async (
	params: GetC4STopStudiosParams,
): Promise<GetC4STopStudiosData> => {
	const details = await getC4SCategoryDetails({
		id: params.categoryId,
		language: params.language,
		sexualPreferences: params.sexualPreferences,
	})

	let topStores: GetC4STopStudiosData = details.topStores.map((r) => ({
		// clipId: r.clipId,
		// title: r.title,
		// producer: r.producer,
		// bannerLink: r.bannerLink,
		// description: r.description,
		// translations: r.translations,
		// categoryId: r.categoryId,
		// categoryName: r.categoryName,
		// categoryLink: r.categoryLink,
		// duration: r.duration,
		// suggestedClipUrl: r.suggestedClipUrl,
		// previewLink: r.previewLink,
		// customPreviewUrl: r.customPreviewUrl,
		// studioTitle: r.studioTitle,
		// studioLink: r.studioLink,
		// price: r.price,
		...r,
	}))

	for (const page of VALID_SEE_MORE_PAGES) {
		const result = await getC4SCategorySeeMoreTopStores({
			id: params.categoryId,
			page,
			language: params.language,
			sexualPreferences: params.sexualPreferences,
		})

		const mapped: GetC4STopStudiosData = result.map((r) => {
			const storeCatLink = `${r.link}/Cat${r.category.id}-${r.category.name.toUpperCase()}/Page1/C4SSort-recommended/Limit24`
			return {
				storeId: r.id,
				storeName: r.name,
				avatarSrc: r.avatar,
				avatarLink: storeCatLink,
				storeLink: r.link,
				storeCategory: r.category.name,
				storeCategoryLink: r.category.link,
				storeFilteredByCategoryLink: storeCatLink,
				latestClipPreview: r.last_clip.thumbs.rect_md,
				latestClipPreviewLink: r.link,
				latestClipCategory: r.last_clip.category.name,
				latestClipCategoryId: r.last_clip.category.id,
				latestClipUpdate: r.last_clip.added_at,
				totalClips: r.total_clips,
			}
		})

		topStores = topStores.concat(mapped)
	}

	return topStores
}

export {
	getC4STopStudios,
	type GetC4STopStudiosData,
	type GetC4STopStudiosParams,
}
