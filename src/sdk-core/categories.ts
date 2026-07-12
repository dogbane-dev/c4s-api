import { type C4SClient, getC4SClient } from '../client/client'
import type { paths } from '../client/paths.generated'
import { C4SApiError } from '../client/utils'
import type { C4SLanguage } from '../shared/utils'

type GetC4SCategoriesParams = {
	language?: C4SLanguage
}

type GetC4SCategoriesData =
	paths['/clips/ajax/categoriesdropdown']['get']['responses']['200']['content']['application/json']

const baseGetC4SCategories = async (
	params?: GetC4SCategoriesParams,
	client?: C4SClient,
): Promise<GetC4SCategoriesData> => {
	const c = getC4SClient(client)
	const res = await c.GET('/clips/ajax/categoriesdropdown', {
		params: {
			query: {
				lng: params?.language,
			},
		},
	})

	if (!res.data) throw new C4SApiError(res.response)

	if (res.data.code !== 'ok' || !res.data.success) {
		throw new C4SApiError('Failed to fetch categories')
	}

	return res.data
}

/**
 * Fetches the Clips4Sale category dropdown data.
 *
 * @param params - Optional category request options, including response language.
 * @returns Category dropdown metadata and the list of available categories.
 */
const getC4SCategories = async (
	params?: GetC4SCategoriesParams,
): Promise<GetC4SCategoriesData> => {
	return baseGetC4SCategories(params, getC4SClient())
}

type C4SCategory = GetC4SCategoriesData['categories'][number]

const baseGetC4SCategoryByName = async (
	name: string,
	language?: C4SLanguage,
	client?: C4SClient,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	const { categories } = await baseGetC4SCategories({ language }, client)
	const c = categories.find((c) => c.name === name)
	if (!c) {
		throw new Error(`Category ${name} not found`)
	}
	return c
}

/**
 * Finds a Clips4Sale category by its exact display name.
 *
 * @param name - Exact category name to find.
 * @param language - Optional language used when fetching the category list.
 * @returns The matching category entry.
 */
const getC4SCategoryByName = async (
	name: string,
	language?: C4SLanguage,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	return baseGetC4SCategoryByName(name, language, getC4SClient())
}

const baseGetC4SCategoryById = async (
	id: number,
	language?: C4SLanguage,
	client?: C4SClient,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	const { categories } = await baseGetC4SCategories({ language }, client)
	const c = categories.find((c) => c.id === id)
	if (!c) {
		throw new Error(`Category with ID=${id} not found`)
	}
	return c
}

/**
 * Finds a Clips4Sale category by numeric category ID.
 *
 * @param id - Category ID to find.
 * @param language - Optional language used when fetching the category list.
 * @returns The matching category entry.
 */
const getC4SCategoryById = async (
	id: number,
	language?: C4SLanguage,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	return baseGetC4SCategoryById(id, language, getC4SClient())
}

export {
	baseGetC4SCategories,
	baseGetC4SCategoryByName,
	baseGetC4SCategoryById,
	getC4SCategories,
	getC4SCategoryByName,
	getC4SCategoryById,
	type C4SCategory,
	type GetC4SCategoriesParams,
	type GetC4SCategoriesData,
}
