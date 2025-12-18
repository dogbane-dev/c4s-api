import { describe, expect, it } from 'bun:test'
import { CategoriesResponseSchema } from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SCategories } from './categories'

describe('categories', () => {
	it('fetches', async () => {
		const result = await getC4SCategories()

		const parseResult = CategoriesResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Categories response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const catResponse = parseResult.data!
		expect(catResponse).toBeDefined()
		expect(catResponse.code).toBe('ok')
		expect(catResponse.success).toBeTrue()
		expect(catResponse.categories).toBeArray()
		expect(catResponse.recommendations).toBeArray()
	})
})
