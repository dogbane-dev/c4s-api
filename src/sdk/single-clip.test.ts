import { describe, expect, it } from 'bun:test'
import { C4SClipNotFoundError, C4SStudioNotFoundError } from '../client/utils'
import { SingleClipResponseSchema } from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SClip } from './single-clip'

describe('single clip', () => {
	it('fetches with slug provided', async () => {
		const result = await getC4SClip({
			clipId: 29869933,
			studioId: 254031,
			language: 'en',
			clipSlug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
		})

		const parseResult = SingleClipResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Clip response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const clip = parseResult.data!
		expect(clip).toBeDefined()

		const { recommendationsPromise, ...staticDetails } = clip

		expect(recommendationsPromise.pills).toBeArray()
		expect(recommendationsPromise.recommendations).toBeArray()

		expect(staticDetails).toMatchSnapshot()
	})

	it('fetches without slug provided', async () => {
		const result = await getC4SClip({
			clipId: 29869933,
			studioId: 254031,
			language: 'en',
		})
		const parseResult = SingleClipResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Clip response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const clip = parseResult.data!
		expect(clip).toBeDefined()

		const { recommendationsPromise, ...staticDetails } = clip

		expect(recommendationsPromise.pills).toBeArray()
		expect(recommendationsPromise.recommendations).toBeArray()

		expect(staticDetails).toMatchSnapshot()
	})

	it('throws error if clip is not found', () => {
		expect(() =>
			getC4SClip({
				clipId: 123,
				clipSlug: 'not-real',
				studioId: 254031,
				language: 'en',
			}),
		).toThrowError(C4SClipNotFoundError)
	})

	it('throws error if studio is not found', () => {
		expect(() =>
			getC4SClip({
				clipId: 29869933,
				studioId: 1, // not right / real
				language: 'en',
				clipSlug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
			}),
		).toThrowError(C4SStudioNotFoundError)
	})
})
