import { describe, expect, it } from 'bun:test'
import z from 'zod'
import {
	CategorySeeMoreExtraClipSchema,
	CategorySeeMoreExtraStoreSchema,
	CategorySeeMoreResponseSchema,
} from '../open-api/zod'
import { INVALID_SEE_MORE_PAGES, VALID_SEE_MORE_PAGES } from '../shared/utils'
import { formatZodError } from '../testing/utils'
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
					const result = await getC4SCategorySeeMore({
						id: 4,
						page,
						type,
						language: 'en',
					})

					const responseSchema = z.object({
						seeMoreExtra: schema.array(),
					})
					const parseResult = responseSchema.safeParse(result)

					expect(
						parseResult.success,
						formatZodError('Category see more response', parseResult),
					).toBeTrue()

					// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
					const category = parseResult.data!

					expect(category).toBeDefined()
					expect(category.seeMoreExtra).toBeArray()
					expect(
						CategorySeeMoreResponseSchema.safeParse(category).success,
					).toBeTrue()
				})
			})

			INVALID_SEE_MORE_PAGES.forEach((page) => {
				it(`fetches page ${page} (empty)`, async () => {
					const result = await getC4SCategorySeeMore({
						id: 4,
						page,
						type: 'top-stores',
						language: 'en',
					})

					const responseSchema = z.object({
						seeMoreExtra: schema.array(),
					})
					const parseResult = responseSchema.safeParse(result)

					expect(
						parseResult.success,
						formatZodError('Category see more response', parseResult),
					).toBeTrue()

					expect(parseResult.data?.seeMoreExtra).toBeArrayOfSize(0)
				})
			})
		})
	})
})
