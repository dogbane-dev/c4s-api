import { describe, expect, it } from 'bun:test'
import { CategoriesResponseSchema } from '../open-api/zod'
import { expectMatchesSchema, getMockClient } from '../utils/testing'
import { getC4SCategories } from './categories'

describe('categories', () => {
	it('fetches', async () => {
		const mockClient = getMockClient()
		const result = await getC4SCategories(undefined, mockClient)

		const catResponse = expectMatchesSchema(
			result,
			CategoriesResponseSchema,
			'Categories response',
		)
		expect(catResponse).toBeDefined()
		expect(catResponse.code).toBe('ok')
		expect(catResponse.success).toBeTrue()
		expect(catResponse.categories).toBeArray()
		const c = catResponse.categories.find((c) => c.id === 1)
		expect(c?.name).toBe('Foot Fetish')
		expect(catResponse.recommendations).toBeArray()

		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches - different language', async () => {
		const mockClient = getMockClient()
		const result = await getC4SCategories({ language: 'fr' }, mockClient)

		const catResponse = expectMatchesSchema(
			result,
			CategoriesResponseSchema,
			'Categories response',
		)
		expect(catResponse).toBeDefined()
		expect(catResponse.code).toBe('ok')
		expect(catResponse.success).toBeTrue()
		expect(catResponse.categories).toBeArray()
		const c = catResponse.categories.find((c) => c.id === 1)
		expect(c?.name).toBe('Fétiche du pied')
		expect(catResponse.recommendations).toBeArray()
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})
})
