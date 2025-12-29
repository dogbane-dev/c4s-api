import { describe, expect, it } from 'bun:test'
import { C4SStudioNotFoundError } from '../client/utils'
import { SingleStudioResponseSchema } from '../open-api/zod'
import { expectMatchesSchema, getMockClient } from '../utils/testing'
import { getC4SStudio } from './single-studio'

describe('single studio', () => {
	it('fetches with slug provided - TRB', async () => {
		const mockClient = getMockClient()
		const result = await getC4SStudio(
			{
				id: 254031,
				language: 'en',
				slug: 'tatti-roana-bondage',
			},
			mockClient,
		)

		const studio = expectMatchesSchema(
			result,
			SingleStudioResponseSchema,
			'Studio response',
		)

		const { followersCount, clipsCount, clips, onSaleClips, ...staticDetails } =
			studio

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()
		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches with slug provided - TT', async () => {
		const mockClient = getMockClient()
		const result = await getC4SStudio(
			{
				id: 111172,
				language: 'en',
				slug: 'tied-tales',
			},
			mockClient,
		)

		const studio = expectMatchesSchema(
			result,
			SingleStudioResponseSchema,
			'Studio response',
		)

		const { followersCount, clipsCount, clips, onSaleClips, ...staticDetails } =
			studio

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()
		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches without slug provided - handles remix redirect', async () => {
		const mockClient = getMockClient()
		const result = await getC4SStudio(
			{
				id: 254031,
				language: 'en',
			},
			mockClient,
		)
		const studio = expectMatchesSchema(
			result,
			SingleStudioResponseSchema,
			'Studio response',
		)

		const { followersCount, clipsCount, clips, onSaleClips, ...staticDetails } =
			studio

		expect(clips).toBeArray()
		expect(onSaleClips).toBeArray()
		expect(followersCount).toBeNumber()
		expect(clipsCount).toBeNumber()

		expect(staticDetails).toBeDefined()
		expect(staticDetails).toMatchSnapshot()
		expect(mockClient.fetch).toHaveBeenCalledTimes(2)
	})

	it('throws error if studio is not found', () => {
		const mockClient = getMockClient()
		expect(() =>
			getC4SStudio(
				{
					id: 1, // not right / real
					slug: 'tatti-roana-bondage',
					language: 'en',
				},
				mockClient,
			),
		).toThrowError(C4SStudioNotFoundError)
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})
})
