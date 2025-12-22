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
import type { Language } from './shared/utils'

interface C4SClientSDK {
	getCategories: (
		params: GetC4SCategoriesParams,
	) => Promise<GetC4SCategoriesData>
	getCategoryById: (id: number) => Promise<C4SCategory>
	getCategoryByName: (name: string, language?: Language) => Promise<C4SCategory>
	getCategoryDetails: (
		params: GetC4SCategoryDetailsParams,
	) => Promise<GetC4SCategoryDetailsData>
	getClip: (params: GetC4SClipParams) => Promise<GetC4SClipData>
	getStudio: (params: GetC4SStudioParams) => Promise<GetC4SStudioData>
	searchStudio: (
		params: GetC4SStudioClipsParams,
	) => Promise<GetC4SStudioClipsData>
	getTopStudios: (
		params: GetC4STopStudiosParams,
	) => Promise<GetC4STopStudiosData>
	getTopClips: (params: GetC4STopClipsParams) => Promise<GetC4STopClipsData>
	getAllStudioClips: (
		params: GetC4SAllStudioClipsParams,
	) => Promise<GetC4SAllStudioClipsData>
	searchClips: (params: SearchC4SClipsParams) => Promise<SearchC4SClipsData>
}

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
