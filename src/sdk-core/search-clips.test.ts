import { describe, expect, it } from 'bun:test'
import { ClipSearchResponseSchema } from '../open-api/zod'
import {
	enumerateTestCases,
	expectMatchesSchema,
	getMockClient,
	prettyPrint,
} from '../utils/testing'
import { type SearchC4SClipsParams, searchC4SClips } from './search-clips'

const testCases = enumerateTestCases<SearchC4SClipsParams>({
	language: [undefined, 'en'],
	search: [undefined, 'robe'],
	page: [1, 3],
	sort: ['most-popular', 'most-recent'],
	filter: [
		undefined,
		{
			past: '7d',
			format: ['mp4', 'wmv'],
		},
		{
			category: '4',
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

			const { clips, activeFilters } = searchData

			expect(clips).toBeArray()
			expect(clips.length).toBeGreaterThan(0)

			if (testCase.filter) {
				expect(activeFilters).not.toBeEmptyObject()
				const { past } = testCase.filter
				expect(activeFilters.date).toEqual(past ? [past] : null)
				// TODO - more expects for active filters to match test case
			} else {
				expect(activeFilters).toBeEmptyObject()
			}

			expect(mockClient.fetch).toHaveBeenCalledTimes(1)
		})
	}
})
