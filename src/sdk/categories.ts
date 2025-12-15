import { client } from '../client'
import type { paths } from '../open-api/paths.generated'

type GetC4SCategoriesData =
	paths['/clips/ajax/categoriesdropdown']['get']['responses']['200']['content']['application/json']

const getC4SCategories = async (): Promise<GetC4SCategoriesData> => {
	const res = await client.GET('/clips/ajax/categoriesdropdown')

	if (!res.data) throw new Error('No data')

	if (res.data.code !== 'ok' || !res.data.success) {
		throw new Error('Failed to fetch categories')
	}

	return res.data
}

type C4SCategory = GetC4SCategoriesData['categories'][number]

const getC4SCategoryByName = async (
	name: string,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	const res = await client.GET('/clips/ajax/categoriesdropdown')
	if (!res.data) throw new Error('No data')
	if (res.data.code !== 'ok' || !res.data.success) {
		throw new Error('Failed to fetch categories')
	}
	const c = res.data.categories.find((c) => c.name === name)
	if (!c) {
		throw new Error(`Category ${name} not found`)
	}
	return c
}

const getC4SCategoryById = async (
	id: number,
): Promise<GetC4SCategoriesData['categories'][number]> => {
	const res = await client.GET('/clips/ajax/categoriesdropdown')
	if (!res.data) throw new Error('No data')
	if (res.data.code !== 'ok' || !res.data.success) {
		throw new Error('Failed to fetch categories')
	}
	const c = res.data.categories.find((c) => c.id === id)
	if (!c) {
		throw new Error(`Category ${name} not found`)
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
