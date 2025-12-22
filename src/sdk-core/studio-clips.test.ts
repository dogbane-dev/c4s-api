import { describe, expect, it } from 'bun:test'
import { StudioClipSearchResponseSchema } from '../open-api/zod'
import { expectMatchesSchema, getMockClient } from '../testing/utils'
import { getC4SStudioClips } from './studio-clips'

describe('studio clips', () => {
	it('fetches with all options provided', async () => {
		const mockClient = getMockClient()
		const result = await getC4SStudioClips(
			{
				id: 254031,
				language: 'en',
				slug: 'tatti-roana-bondage',
				page: 1,
				sort: 'recommended',
				categoryId: 0,
			},
			mockClient,
		)

		const clipSearch = expectMatchesSchema(
			result,
			StudioClipSearchResponseSchema,
			'Studio clip search response',
		)

		const { clips, onSaleClips, followersCount, clipsCount, ...staticDetails } =
			clipSearch

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches only clips with all options provided', async () => {
		const mockClient = getMockClient()
		const result = await getC4SStudioClips(
			{
				id: 254031,
				language: 'en',
				slug: 'tatti-roana-bondage',
				page: 1,
				sort: 'recommended',
				categoryId: 0,
				onlyClips: true,
			},
			mockClient,
		)

		const clipSearch = expectMatchesSchema(
			result,
			StudioClipSearchResponseSchema,
			'Studio clip search response',
		)

		const { clips, onSaleClips, ...otherDetails } = clipSearch

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		// no other details should be returned because onlyClips is true
		expect(otherDetails).toBeEmptyObject()

		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches without slug provided - handles remix redirect', async () => {
		const mockClient = getMockClient()
		const result = await getC4SStudioClips(
			{
				id: 254031,
				language: 'en',
				page: 1,
				sort: 'recommended',
				categoryId: 0,
			},
			mockClient,
		)

		const clipSearch = expectMatchesSchema(
			result,
			StudioClipSearchResponseSchema,
			'Studio clip search response',
		)

		const { clips, onSaleClips, followersCount, clipsCount, ...staticDetails } =
			clipSearch

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
		expect(mockClient.fetch).toHaveBeenCalledTimes(2)
	})

	it('fetches with all options provided and search term', async () => {
		const SEARCH = 'ball gag'

		const mockClient = getMockClient()
		const result = await getC4SStudioClips(
			{
				id: 254031,
				language: 'en',
				slug: 'tatti-roana-bondage',
				page: 1,
				sort: 'recommended',
				categoryId: 0,
				search: SEARCH,
			},
			mockClient,
		)

		const clipSearch = expectMatchesSchema(
			result,
			StudioClipSearchResponseSchema,
			'Studio clip search response',
		)

		const {
			clips,
			onSaleClips,
			followersCount,
			clipsCount,
			keyword,
			...staticDetails
		} = clipSearch

		expect(keyword).toBe(SEARCH)

		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()
		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()

		expect(staticDetails).toBeDefined()

		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})
})
