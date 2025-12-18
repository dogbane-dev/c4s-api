import {
	type C4SCategory,
	type GetC4SCategoriesData,
	getC4SCategories,
	getC4SCategoryById,
	getC4SCategoryByName,
} from './sdk-core/categories'

interface C4SClient {
	getCategories: () => Promise<GetC4SCategoriesData>
	getCategoryById: (id: number) => Promise<C4SCategory>
	getCategoryByName: (name: string) => Promise<C4SCategory>
}

const c4s: C4SClient = {
	getCategories: getC4SCategories,
	getCategoryById: getC4SCategoryById,
	getCategoryByName: getC4SCategoryByName,
}

export { c4s }
