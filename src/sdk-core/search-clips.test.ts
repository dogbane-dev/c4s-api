import { describe, expect, it } from 'bun:test'
import { ClipSearchResponseSchema } from '../open-api/zod'
import {
	enumerateTestCases,
	expectMatchesSchema,
	getMockClient,
	prettyPrint,
} from '../testing/utils'
import { type SearchC4SClipsParams, searchC4SClips } from './search-clips'

const testCases = enumerateTestCases<SearchC4SClipsParams>({
	language: [undefined, 'en'],
	category: [undefined, 4],
	search: [undefined, 'robe'],
	page: [1],
	sort: ['bestmatch', 'mostrecent'],
	filter: [
		undefined,
		{
			past: '7d',
		},
	],
})

describe('clip search', () => {
	for (const testCase of testCases) {
		const i = testCases.indexOf(testCase)
		it(`[${i + 1}/${testCases.length}] searches for clips with parameters: ${prettyPrint(testCase)}`, async () => {
			const mockClient = getMockClient()
			const result = await searchC4SClips(testCase, mockClient)

			const searchData = expectMatchesSchema(
				result,
				ClipSearchResponseSchema,
				'Clip search response',
			)

			const { clips } = searchData

			expect(clips).toBeArray()
			expect(clips.length).toBeGreaterThan(0)

			expect(mockClient.fetch).toHaveBeenCalledTimes(1)
		})
	}
})
