import { describe, expect, it } from 'bun:test'
import { C4SStudioNotFoundError } from '../client/utils'
import { SingleStudioResponseSchema } from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SStudio } from './single-studio'

describe('single studio', () => {
	it('fetches with slug provided', async () => {
		const result = await getC4SStudio({
			studioId: 254031,
			language: 'en',
			studioSlug: 'tatti-roana-bondage',
		})
		const parseResult = SingleStudioResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Studio response', parseResult),
		).toBeTrue()

		const { followersCount, clipsCount, clips, onSaleClips, ...staticDetails } =
			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			parseResult.data!

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()
		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
	})

	it('fetches without slug provided - handles remix redirect', async () => {
		const result = await getC4SStudio({
			studioId: 254031,
			language: 'en',
		})
		const parseResult = SingleStudioResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Studio response', parseResult),
		).toBeTrue()

		const { followersCount, clipsCount, clips, onSaleClips, ...staticDetails } =
			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			parseResult.data!

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()
		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
	})

	it('throws error if studio is not found', () => {
		expect(() =>
			getC4SStudio({
				studioId: 1, // not right / real
				language: 'en',
				studioSlug: 'tatti-roana-bondage',
			}),
		).toThrowError(C4SStudioNotFoundError)
	})
})
