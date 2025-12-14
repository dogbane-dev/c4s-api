import { describe, expect, it } from 'bun:test'
import z from 'zod'
import {
	SeeMoreExtraClipSchema,
	SeeMoreExtraStoreSchema,
	SeeMoreResponseSchema,
} from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SCategoryAdditionalDetails } from './category-additional-details'

describe('category details', () => {
	it('fetches - top stores', async () => {
		const result = await getC4SCategoryAdditionalDetails({
			id: 4,
			page: 2,
			section: 'top-stores-see-more',
			lng: 'en',
		})

		const schema = z.object({
			seeMoreExtra: SeeMoreExtraStoreSchema.array(),
		})
		const parseResult = schema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Category additional info response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const category = parseResult.data!

		expect(category).toBeDefined()
		expect(category.seeMoreExtra).toBeArray()
		expect(SeeMoreResponseSchema.safeParse(category).success).toBeTrue()
	})

	it('fetches - top clips', async () => {
		const result = await getC4SCategoryAdditionalDetails({
			id: 4,
			page: 2,
			section: 'top-clips-see-more',
			lng: 'en',
		})

		const schema = z.object({
			seeMoreExtra: SeeMoreExtraClipSchema.array(),
		})
		const parseResult = schema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Category additional info response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const category = parseResult.data!

		expect(category).toBeDefined()
		expect(category.seeMoreExtra).toBeArray()
		expect(SeeMoreResponseSchema.safeParse(category).success).toBeTrue()
	})

	it('fetches - recently added / related', async () => {
		const result = await getC4SCategoryAdditionalDetails({
			id: 4,
			page: 2,
			section: 'recently-added-related-clips-see-more',
			lng: 'en',
		})

		const schema = z.object({
			seeMoreExtra: SeeMoreExtraClipSchema.array(),
		})
		const parseResult = schema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Category additional info response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const category = parseResult.data!

		expect(category).toBeDefined()
		expect(category.seeMoreExtra).toBeArray()
		expect(SeeMoreResponseSchema.safeParse(category).success).toBeTrue()
	})
})
