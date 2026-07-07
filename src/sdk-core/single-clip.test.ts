import { describe, expect, it } from 'bun:test'
import { C4SClipNotFoundError, C4SStudioNotFoundError } from '../client/utils'
import { SingleClipResponseSchema } from '../open-api/zod'
import {
	expectMatchesSchema,
	getMockC4SMethodClient,
	getMockClient,
} from '../utils/testing'
import { getC4SClip, getC4SClipByUrl } from './single-clip'

describe('single clip', () => {
	it('fetches by URL', async () => {
		const mockClient = getMockC4SMethodClient()

		await getC4SClipByUrl(
			'https://www.clips4sale.com/studio/28730/34039699/astrid-captured-in-her-bedroom-bondage-struggle-with-tight-tape-gag-full-hd-mp4',
			mockClient,
		)

		expect(mockClient.GET).toHaveBeenCalledTimes(1)
	})

	it('fetches with slug provided', async () => {
		const mockClient = getMockClient()
		const result = await getC4SClip(
			{
				id: 29869933,
				studioId: 254031,
				language: 'en',
				slug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
			},
			mockClient,
		)

		const clip = expectMatchesSchema(
			result,
			SingleClipResponseSchema,
			'Clip response',
		)
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
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches without slug provided - handles remix redirect', async () => {
		const mockClient = getMockClient()
		const result = await getC4SClip(
			{
				id: 29869933,
				studioId: 254031,
				language: 'en',
			},
			mockClient,
		)

		const clip = expectMatchesSchema(
			result,
			SingleClipResponseSchema,
			'Clip response',
		)
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
		expect(mockClient.fetch).toHaveBeenCalledTimes(2)
	})

	it('fetches with slug provided without language - handles request rewrite', async () => {
		const mockClient = getMockClient()
		const result = await getC4SClip(
			{
				id: 29869933,
				studioId: 254031,
				slug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
			},
			mockClient,
		)

		const clip = expectMatchesSchema(
			result,
			SingleClipResponseSchema,
			'Clip response',
		)
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
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('throws error if clip is not found', () => {
		const mockClient = getMockClient()
		expect(() =>
			getC4SClip(
				{
					id: 123,
					slug: 'not-real',
					studioId: 254031,
					language: 'en',
				},
				mockClient,
			),
		).toThrowError(C4SClipNotFoundError)
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('throws error if studio is not found', () => {
		const mockClient = getMockClient()
		expect(() =>
			getC4SClip(
				{
					id: 29869933,
					studioId: 1, // not right / real
					language: 'en',
					slug: 'tatti-swallows-intruder-cum-then-fucked-again-4k',
				},
				mockClient,
			),
		).toThrowError(C4SStudioNotFoundError)
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('throws error if clip has been removed due to studio removal', () => {
		const mockClient = getMockClient()
		expect(() =>
			getC4SClip(
				{
					id: 32768163,
					slug: 'deep-throat-training-for-latex-jk-schoolgirls',
					// studio was removed as far as I know
					studioId: 401417,
					language: 'en',
				},
				mockClient,
			),
		).toThrowError(C4SClipNotFoundError)
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})

	it('fetches clip that is under review', async () => {
		const mockClient = getMockClient()
		const result = await getC4SClip(
			{
				id: 20424263,
				studioId: 96993,
				language: 'en',
				slug: 'chrissy-marie-leotard-chairtied-mp4',
			},
			mockClient,
		)

		const clip = expectMatchesSchema(
			result,
			SingleClipResponseSchema,
			'Clip response',
		)
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
		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	})
})
