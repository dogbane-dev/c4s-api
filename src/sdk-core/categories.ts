import { client } from '../client'
import type { paths } from '../client/paths.generated'
import type { Language } from '../shared/utils'

type GetC4SCategoriesParams = {
	language?: Language
}

type GetC4SCategoriesData =
	paths['/clips/ajax/categoriesdropdown']['get']['responses']['200']['content']['application/json']

const getC4SCategories = async (
	params?: GetC4SCategoriesParams,
): Promise<GetC4SCategoriesData> => {
	const res = await client.GET('/clips/ajax/categoriesdropdown', {
		params: {
			query: {
				lng: params?.language,
			},
		},
	})

	if (!res.data) throw new Error('No data')

	if (res.data.code !== 'ok' || !res.data.success) {
		throw new Error('Failed to fetch categories')
	}

	return res.data
}

type C4SCategory = GetC4SCategoriesData['categories'][number]

const getC4SCategoryByName = async (
	name: string,
	language?: Language,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	const { categories } = await getC4SCategories({ language })
	const c = categories.find((c) => c.name === name)
	if (!c) {
		throw new Error(`Category ${name} not found`)
	}
	return c
}

const getC4SCategoryById = async (
	id: number,
	language?: Language,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	const { categories } = await getC4SCategories({ language })
	const c = categories.find((c) => c.id === id)
	if (!c) {
		throw new Error(`Category with ID=${id} not found`)
	}
	return c
}

export {
	getC4SCategories,
	getC4SCategoryByName,
	getC4SCategoryById,
	type C4SCategory,
	type GetC4SCategoriesData,
}
