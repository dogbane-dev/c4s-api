import { describe, expect, it } from 'bun:test'
import { ClipSearchResponseSchema } from '../open-api/zod'
import {
	enumerateTestCases,
	expectMatchesSchema,
	getMockClient,
	prettyPrint,
} from '../utils/testing'
import { type SearchC4SClipsParams, searchC4SClips } from './search-clips'

const searchFilterSortCases = enumerateTestCases<SearchC4SClipsParams>({
	language: ['en'], //
	search: [undefined, 'bondage'],
	page: [1, 3],
	sort: ['most-popular', 'most-recent'],
	filter: [
		undefined,
		{
			past: '30d',
			format: ['mp4', 'wmv'],
		},
		{
			category: '4',
		},
	],
	disableSpellcheck: [false],
})

const performerCases = enumerateTestCases<SearchC4SClipsParams>({
	language: ['en'], //
	search: [undefined],
	page: [1],
	sort: ['most-popular'],
	filter: [
		{
			performer: 351815,
		},
		{
			performer: [56078, 365101],
		},
	],
	disableSpellcheck: [false],
})

const spellcheckCases = enumerateTestCases<SearchC4SClipsParams>({
	language: ['en'], //
	search: ['bondafe', 'Portia Everly'],
	page: [1],
	sort: ['most-popular'],
	filter: [undefined],
	disableSpellcheck: [true, false],
})

describe('clip search', () => {
	const testSearch = async (testCase: SearchC4SClipsParams) => {
		const mockClient = getMockClient()
		const result = await searchC4SClips(testCase, mockClient)

		const searchData = expectMatchesSchema(
			result,
			ClipSearchResponseSchema,
			'Clip search response',
		)

		const { clips, data, activeFilters, spellcheck } = searchData

		expect(clips).toBeArray()
		if (!data.message) {
			expect(clips.length).toBeGreaterThan(0)
		}

		if (testCase.disableSpellcheck) {
			expect(spellcheck?.params?.search_without_spellchecking).toBeUndefined()
		}

		if (testCase.filter && Object.keys(testCase.filter).length > 0) {
			expect(activeFilters).not.toBeEmptyObject()
			const { past } = testCase.filter
			expect(activeFilters.date).toEqual(past ? [past] : null)
			// TODO - more expects for active filters to match test case
		} else {
			expect(activeFilters).toBeEmptyObject()
		}

		expect(mockClient.fetch).toHaveBeenCalledTimes(1)
	}

	const allCases = [
		...searchFilterSortCases,
		...performerCases,
		...spellcheckCases,
	]

	for (let i = 0; i < allCases.length; i++) {
		const testCase = allCases[i]
		it(`[${i + 1}/${allCases.length}] searches for clips with parameters: ${prettyPrint(testCase)}`, async () => {
			await testSearch(testCase)
		})
	}
})
