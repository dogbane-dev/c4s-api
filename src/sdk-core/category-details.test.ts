import { describe, expect, it } from 'bun:test'
import { CategoryInfoResponseSchema } from '../open-api/zod'
import { expectMatchesSchema, getMockClient } from '../testing/utils'
import { getC4SCategoryDetails } from './category-details'

describe('category details', () => {
	it('fetches', async () => {
		const mockClient = getMockClient()
		const result = await getC4SCategoryDetails(
			{
				language: 'en',
				id: 4,
			},
			mockClient,
		)

		const category = expectMatchesSchema(
			result,
			CategoryInfoResponseSchema,
			'Category info response',
		)
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
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})
})
