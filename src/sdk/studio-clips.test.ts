import { describe, expect, it } from 'bun:test'
import { StudioClipSearchResponseSchema } from '../open-api/zod'
import { formatZodError } from '../testing/utils'
import { getC4SStudioClips } from './studio-clips'

describe('studio clips', () => {
	it('fetches with all options provided', async () => {
		const result = await getC4SStudioClips({
			studioId: 254031,
			language: 'en',
			studioSlug: 'tatti-roana-bondage',
			page: 1,
			sort: 'recommended',
			category: 0,
		})

		const parseResult = StudioClipSearchResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Studio clip search response', parseResult),
		).toBeTrue()

		const { clips, onSaleClips, followersCount, clipsCount, ...staticDetails } =
			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			parseResult.data!

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
	})

	it('fetches only clips with all options provided', async () => {
		const result = await getC4SStudioClips({
			studioId: 254031,
			language: 'en',
			studioSlug: 'tatti-roana-bondage',
			page: 1,
			sort: 'recommended',
			category: 0,
			onlyClips: true,
		})

		const parseResult = StudioClipSearchResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Studio clip search response', parseResult),
		).toBeTrue()

		const { clips, onSaleClips, ...otherDetails } =
			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			parseResult.data!

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		// no other details should be returned because onlyClips is true
		expect(otherDetails).toBeEmptyObject()
	})

	it('fetches without slug provided - handles remix redirect', async () => {
		const result = await getC4SStudioClips({
			studioId: 254031,
			language: 'en',
			page: 1,
			sort: 'recommended',
			category: 0,
		})

		const parseResult = StudioClipSearchResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Studio clip search response', parseResult),
		).toBeTrue()

		const { clips, onSaleClips, followersCount, clipsCount, ...staticDetails } =
			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			parseResult.data!

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
	})

	it('fetches with all options provided and search term', async () => {
		const SEARCH = 'ball gag'

		const result = await getC4SStudioClips({
			studioId: 254031,
			language: 'en',
			studioSlug: 'tatti-roana-bondage',
			page: 1,
			sort: 'recommended',
			category: 0,
			search: SEARCH,
		})

		await Bun.file('./debug.json').write(JSON.stringify(result, null, 2))

		const parseResult = StudioClipSearchResponseSchema.safeParse(result)

		expect(
			parseResult.success,
			formatZodError('Studio clip search response', parseResult),
		).toBeTrue()

		const {
			clips,
			onSaleClips,
			followersCount,
			clipsCount,
			keyword,
			...staticDetails
		} =
			// biome-ignore lint/style/noNonNullAssertion: previous expect asserts success
			parseResult.data!

		expect(keyword).toBe(SEARCH)

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		expect(staticDetails).toBeDefined()
	})
})
