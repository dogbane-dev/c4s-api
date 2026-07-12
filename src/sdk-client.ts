import {
	type C4SCategory,
	type GetC4SCategoriesData,
	type GetC4SCategoriesParams,
	type GetC4SCategoryDetailsData,
	type GetC4SCategoryDetailsParams,
	type GetC4SClipData,
	type GetC4SClipParams,
	type GetC4SStudioClipsData,
	type GetC4SStudioClipsParams,
	type GetC4SStudioData,
	type GetC4SStudioParams,
	getC4SCategories,
	getC4SCategoryById,
	getC4SCategoryByName,
	getC4SCategoryDetails,
	getC4SClip,
	getC4SStudio,
	getC4SStudioClips,
	type SearchC4SClipsData,
	type SearchC4SClipsParams,
	searchC4SClips,
} from './sdk-core'
import {
	type GetC4SAllStudioClipsData,
	type GetC4SAllStudioClipsParams,
	type GetC4STopClipsData,
	type GetC4STopClipsParams,
	type GetC4STopStudiosData,
	type GetC4STopStudiosParams,
	getC4SAllStudioClips,
	getC4STopClips,
	getC4STopStudios,
} from './sdk-extended'
import type { C4SLanguage } from './shared/utils'

interface C4SClientSDK {
	/**
	 * Fetches the Clips4Sale category dropdown data.
	 *
	 * @param params - Optional category request options, including response language.
	 * @returns Category dropdown metadata and available categories.
	 */
	getCategories: (
		params: GetC4SCategoriesParams,
	) => Promise<GetC4SCategoriesData>

	/**
	 * Finds a Clips4Sale category by numeric category ID.
	 *
	 * @param id - Category ID to find.
	 * @returns The matching category entry.
	 */
	getCategoryById: (id: number) => Promise<C4SCategory>

	/**
	 * Finds a Clips4Sale category by exact display name.
	 *
	 * @param name - Exact category name to find.
	 * @param language - Optional language used when fetching the category list.
	 * @returns The matching category entry.
	 */
	getCategoryByName: (
		name: string,
		language?: C4SLanguage,
	) => Promise<C4SCategory>

	/**
	 * Fetches the detail page data for a Clips4Sale category.
	 *
	 * @param params - Category ID, optional language, and optional sexual
	 * preference filters.
	 * @returns Category page data such as metadata, top clips, and top stores.
	 */
	getCategoryDetails: (
		params: GetC4SCategoryDetailsParams,
	) => Promise<GetC4SCategoryDetailsData>

	/**
	 * Fetches a single Clips4Sale clip by clip ID and optional studio context.
	 *
	 * @param params - Clip ID, optional studio ID, optional slug, and optional
	 * language.
	 * @returns Single clip detail data.
	 */
	getClip: (params: GetC4SClipParams) => Promise<GetC4SClipData>

	/**
	 * Fetches a single Clips4Sale studio by studio ID.
	 *
	 * @param params - Studio ID, optional studio slug, and optional language.
	 * @returns Single studio detail data.
	 */
	getStudio: (params: GetC4SStudioParams) => Promise<GetC4SStudioData>

	/**
	 * Fetches or searches a Clips4Sale studio's paginated clip list.
	 *
	 * @param params - Studio clip query options, including studio ID, page,
	 * category, sort, search text, and language.
	 * @returns Studio clip search data.
	 */
	searchStudio: (
		params: GetC4SStudioClipsParams,
	) => Promise<GetC4SStudioClipsData>

	/**
	 * Fetches all known top studios for a Clips4Sale category.
	 *
	 * @param params - Category ID, optional language, and optional sexual
	 * preference filters.
	 * @returns Combined top studio entries.
	 */
	getTopStudios: (
		params: GetC4STopStudiosParams,
	) => Promise<GetC4STopStudiosData>

	/**
	 * Fetches all known top clips for a Clips4Sale category.
	 *
	 * @param params - Category ID, optional language, and optional sexual
	 * preference filters.
	 * @returns Combined top clip entries.
	 */
	getTopClips: (params: GetC4STopClipsParams) => Promise<GetC4STopClipsData>

	/**
	 * Fetches every available clip page for a Clips4Sale studio.
	 *
	 * @param params - Studio clip query options excluding page and `onlyClips`,
	 * plus an optional page callback.
	 * @returns A flat array of all fetched studio clips.
	 */
	getAllStudioClips: (
		params: GetC4SAllStudioClipsParams,
	) => Promise<GetC4SAllStudioClipsData>

	/**
	 * Searches Clips4Sale clips by text, filters, sorting, and page.
	 *
	 * @param params - Search options, including text, filters, page, sort, and
	 * language.
	 * @returns Clip search results and search metadata.
	 */
	searchClips: (params: SearchC4SClipsParams) => Promise<SearchC4SClipsData>
}

/**
 * Convenience SDK object that groups the primary Clips4Sale API methods.
 */
const c4s: C4SClientSDK = {
	getCategories: getC4SCategories,
	getCategoryById: getC4SCategoryById,
	getCategoryByName: getC4SCategoryByName,
	getCategoryDetails: getC4SCategoryDetails,
	getClip: getC4SClip,
	getStudio: getC4SStudio,
	searchStudio: getC4SStudioClips,
	getTopStudios: getC4STopStudios,
	getTopClips: getC4STopClips,
	getAllStudioClips: getC4SAllStudioClips,
	searchClips: searchC4SClips,
}

export { c4s }
