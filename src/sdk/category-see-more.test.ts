import { describe, expect, it } from 'bun:test'
import z from 'zod'
import {
	CategorySeeMoreExtraClipSchema,
	CategorySeeMoreExtraStoreSchema,
	CategorySeeMoreResponseSchema,
} from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import {
	getC4SCategorySeeMore,
	getC4SCategorySeeMoreRecentlyAddedRelatedClips,
	getC4SCategorySeeMoreTopClips,
	getC4SCategorySeeMoreTopStores,
} from './category-see-more'

describe('category details', () => {
	describe('getC4SCategorySeeMore', () => {
		const VALID_PAGES = [2, 3]

		VALID_PAGES.forEach((page) => {
			it(`fetches page ${page} - top stores`, async () => {
				const result = await getC4SCategorySeeMore({
					id: 4,
					page,
					section: 'top-stores-see-more',
					lng: 'en',
				})

				const schema = z.object({
					seeMoreExtra: CategorySeeMoreExtraStoreSchema.array(),
				})
				const parseResult = schema.safeParse(result)

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

			it(`fetches page ${page} - top clips`, async () => {
				const result = await getC4SCategorySeeMore({
					id: 4,
					page,
					section: 'top-clips-see-more',
					lng: 'en',
				})

				const schema = z.object({
					seeMoreExtra: CategorySeeMoreExtraClipSchema.array(),
				})
				const parseResult = schema.safeParse(result)

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

			it(`fetches page ${page} - recently added / related`, async () => {
				const result = await getC4SCategorySeeMore({
					id: 4,
					page,
					section: 'recently-added-related-clips-see-more',
					lng: 'en',
				})

				const schema = z.object({
					seeMoreExtra: CategorySeeMoreExtraClipSchema.array(),
				})
				const parseResult = schema.safeParse(result)

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

		const INVALID_PAGES = [1, 4]

		INVALID_PAGES.forEach((page) => {
			it(`fetches page ${page} (empty) - top stores`, async () => {
				const result = await getC4SCategorySeeMore({
					id: 4,
					page,
					section: 'top-stores-see-more',
					lng: 'en',
				})

				const schema = z.object({
					seeMoreExtra: CategorySeeMoreExtraStoreSchema.array(),
				})
				const parseResult = schema.safeParse(result)

				expect(
					parseResult.success,
					formatZodError('Category see more response', parseResult),
				).toBeTrue()

				expect(parseResult.data?.seeMoreExtra).toBeArrayOfSize(0)
			})

			it(`fetches page ${page} (empty) - top clips`, async () => {
				const result = await getC4SCategorySeeMore({
					id: 4,
					page,
					section: 'top-clips-see-more',
					lng: 'en',
				})

				const schema = z.object({
					seeMoreExtra: CategorySeeMoreExtraClipSchema.array(),
				})
				const parseResult = schema.safeParse(result)

				expect(
					parseResult.success,
					formatZodError('Category see more response', parseResult),
				).toBeTrue()

				expect(parseResult.data?.seeMoreExtra).toBeArrayOfSize(0)
			})

			it(`fetches page ${page} (empty) - recently added / related`, async () => {
				const result = await getC4SCategorySeeMore({
					id: 4,
					page,
					section: 'recently-added-related-clips-see-more',
					lng: 'en',
				})

				const schema = z.object({
					seeMoreExtra: CategorySeeMoreExtraClipSchema.array(),
				})
				const parseResult = schema.safeParse(result)

				expect(
					parseResult.success,
					formatZodError('Category see more response', parseResult),
				).toBeTrue()

				expect(parseResult.data?.seeMoreExtra).toBeArrayOfSize(0)
			})
		})
	})

	describe('abstraction methods', () => {
		it('getC4SCategorySeeMoreTopClips', async () => {
			const result = await getC4SCategorySeeMoreTopClips({
				id: 4,
				page: 2,
				lng: 'en',
			})

			const parseResult = z
				.array(CategorySeeMoreExtraClipSchema)
				.safeParse(result)

			expect(
				parseResult.success,
				formatZodError('Category see more response', parseResult),
			).toBeTrue()

			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			const data = parseResult.data!
			expect(data).toBeArray()
		})

		it('getC4SCategorySeeMoreTopStores', async () => {
			const result = await getC4SCategorySeeMoreTopStores({
				id: 4,
				page: 2,
				lng: 'en',
			})

			const parseResult = z
				.array(CategorySeeMoreExtraStoreSchema)
				.safeParse(result)

			expect(
				parseResult.success,
				formatZodError('Category see more response', parseResult),
			).toBeTrue()

			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			const data = parseResult.data!

			expect(data).toBeArray()
		})

		it('getC4SCategorySeeMoreRecentlyAddedRelatedClips', async () => {
			const result = await getC4SCategorySeeMoreRecentlyAddedRelatedClips({
				id: 4,
				page: 2,
				lng: 'en',
			})

			const parseResult = z
				.array(CategorySeeMoreExtraClipSchema)
				.safeParse(result)

			expect(
				parseResult.success,
				formatZodError('Category see more response', parseResult),
			).toBeTrue()

			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			const data = parseResult.data!

			expect(data).toBeArray()
		})
	})
})
