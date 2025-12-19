import { describe, expect, it } from 'bun:test'
import { C4SClipNotFoundError, C4SStudioNotFoundError } from '../client/utils'
import { SingleClipResponseSchema } from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SClip } from './single-clip'

describe('single clip', () => {
	it('fetches with slug provided', async () => {
		const result = await getC4SClip({
			id: 29869933,
			studioId: 254031,
			language: 'en',
			slug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
		})

		const parseResult = SingleClipResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Clip response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const clip = parseResult.data!
		expect(clip).toBeDefined()

		// reset dynamic data
		clip.clip.studio.most_recent_clip_id = null
		clip.clip.studio.total_clips = null

		const {
			recommendationsPromise,
			followersCount,
			clipsCount,
			...staticDetails
		} = clip

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(recommendationsPromise.pills).toBeArray()
		expect(recommendationsPromise.recommendations).toBeArray()

		expect(staticDetails).toMatchSnapshot()
	})

	it('fetches without slug provided - handles remix redirect', async () => {
		const result = await getC4SClip({
			id: 29869933,
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

		// reset dynamic data
		clip.clip.studio.most_recent_clip_id = null
		clip.clip.studio.total_clips = null

		const {
			recommendationsPromise,
			followersCount,
			clipsCount,
			...staticDetails
		} = clip

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(recommendationsPromise.pills).toBeArray()
		expect(recommendationsPromise.recommendations).toBeArray()

		expect(staticDetails).toMatchSnapshot()
	})

	it('fetches with slug provided without language - handles request rewrite', async () => {
		const result = await getC4SClip({
			id: 29869933,
			studioId: 254031,
			slug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
		})

		const parseResult = SingleClipResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Clip response', parseResult),
		).toBeTrue()

		// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
		const clip = parseResult.data!
		expect(clip).toBeDefined()

		// reset dynamic data
		clip.clip.studio.most_recent_clip_id = null
		clip.clip.studio.total_clips = null

		const {
			recommendationsPromise,
			followersCount,
			clipsCount,
			...staticDetails
		} = clip

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(recommendationsPromise.pills).toBeArray()
		expect(recommendationsPromise.recommendations).toBeArray()

		expect(staticDetails).toMatchSnapshot()
	})

	it('throws error if clip is not found', () => {
		expect(() =>
			getC4SClip({
				id: 123,
				slug: 'not-real',
				studioId: 254031,
				language: 'en',
			}),
		).toThrowError(C4SClipNotFoundError)
	})

	it('throws error if studio is not found', () => {
		expect(() =>
			getC4SClip({
				id: 29869933,
				studioId: 1, // not right / real
				language: 'en',
				slug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
			}),
		).toThrowError(C4SStudioNotFoundError)
	})
})
