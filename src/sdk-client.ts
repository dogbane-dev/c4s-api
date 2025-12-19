import {
	type GetC4SClipData,
	type GetC4SClipParams,
	type GetC4SStudioClipsData,
	type GetC4SStudioClipsParams,
	type GetC4SStudioData,
	type GetC4SStudioParams,
	getC4SClip,
	getC4SStudio,
	getC4SStudioClips,
} from './sdk-core'
import {
	type C4SCategory,
	type GetC4SCategoriesData,
	getC4SCategories,
	getC4SCategoryById,
	getC4SCategoryByName,
} from './sdk-core/categories'
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

interface C4SClient {
	getCategories: () => Promise<GetC4SCategoriesData>
	getCategoryById: (id: number) => Promise<C4SCategory>
	getCategoryByName: (name: string, language?: Language) => Promise<C4SCategory>
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
}

const c4s: C4SClient = {
	getCategories: getC4SCategories,
	getCategoryById: getC4SCategoryById,
	getCategoryByName: getC4SCategoryByName,
	getClip: getC4SClip,
	getStudio: getC4SStudio,
	searchStudio: getC4SStudioClips,
	getTopStudios: getC4STopStudios,
	getTopClips: getC4STopClips,
	getAllStudioClips: getC4SAllStudioClips,
}

export { c4s }
