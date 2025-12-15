import { describe, expect, it } from 'bun:test'
import { CategoryInfoResponseSchema } from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SCategoryDetails } from './category-details'

describe('category details', () => {
	it('fetches', async () => {
		const result = await getC4SCategoryDetails({
			language: 'en',
			category: 4,
		})

		const parseResult = CategoryInfoResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Category info response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const category = parseResult.data!
		expect(category).toBeDefined()

		const {
			newStores,
			topClips,
			topStores,
			trendingRetroClips,
			recentlyAddedCategoryClips,
			recentlyAddedRelatedClips,
			relatedCategories,
			totals,
			...staticDetails
		} = category

		expect(newStores).toBeArray()
		expect(topClips).toBeArray()
		expect(topStores).toBeArray()
		expect(trendingRetroClips).toBeArray()
		expect(recentlyAddedCategoryClips).toBeArray()
		expect(recentlyAddedRelatedClips).toBeArray()
		expect(relatedCategories).toBeArray()
		expect(totals.clips).toBeNumber()
		expect(totals.stores).toBeNumber()

		expect(staticDetails).toMatchSnapshot()
	})
})
