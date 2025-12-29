import { describe, expect, it } from 'bun:test'
import z from 'zod'
import {
	CategorySeeMoreExtraClipSchema,
	CategorySeeMoreExtraStoreSchema,
	CategorySeeMoreResponseSchema,
} from '../open-api/zod'
import { INVALID_SEE_MORE_PAGES, VALID_SEE_MORE_PAGES } from '../shared/utils'
import { expectMatchesSchema, getMockClient } from '../utils/testing'
import { getC4SCategorySeeMore } from './category-see-more'

const variations = [
	{
		type: 'top-stores' as const,
		schema: CategorySeeMoreExtraStoreSchema,
	},
	{
		type: 'top-clips' as const,
		schema: CategorySeeMoreExtraClipSchema,
	},
	{
		type: 'recently-added-related-clips' as const,
		schema: CategorySeeMoreExtraClipSchema,
	},
]

describe('category details', () => {
	variations.forEach(({ type, schema }) => {
		describe(`get ${type}`, () => {
			VALID_SEE_MORE_PAGES.forEach((page) => {
				it(`fetches page ${page} (valid)`, async () => {
					const mockClient = getMockClient()
					const result = await getC4SCategorySeeMore(
						{
							id: 4,
							page,
							type,
							language: 'en',
						},
						mockClient,
					)

					const responseSchema = z.object({
						seeMoreExtra: z.array(schema),
					})

					const category = expectMatchesSchema(
						result,
						responseSchema,
						'Category see more response',
					)

					expect(category).toBeDefined()
					expect(category.seeMoreExtra).toBeArray()
					expect(
						CategorySeeMoreResponseSchema.safeParse(category).success,
					).toBeTrue()
					expect(mockClient.fetch).toHaveBeenCalledTimes(1)
				})
			})

			INVALID_SEE_MORE_PAGES.forEach((page) => {
				it(`fetches page ${page} (empty)`, async () => {
					const mockClient = getMockClient()
					const result = await getC4SCategorySeeMore(
						{
							id: 4,
							page,
							type: 'top-stores',
							language: 'en',
						},
						mockClient,
					)

					const responseSchema = z.object({
						seeMoreExtra: z.array(schema),
					})

					const category = expectMatchesSchema(
						result,
						responseSchema,
						'Category see more response',
					)

					expect(category?.seeMoreExtra).toBeArrayOfSize(0)
					expect(mockClient.fetch).toHaveBeenCalledTimes(1)
				})
			})
		})
	})
})
