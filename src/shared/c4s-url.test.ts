import { describe, expect, it } from 'bun:test'
import {
	InvalidC4SUrlError,
	parseC4SClipUrl,
	parseC4SStudioUrl,
	safeParseC4SClipUrl,
	safeParseC4SStudioUrl,
} from '../index'

describe('C4S URL parsing', () => {
	describe('Parses clip info from c4s urls', () => {
		it('safely parses a clip URL with a slug', () => {
			expect(
				safeParseC4SClipUrl(
					'https://www.clips4sale.com/studio/28730/34039699/astrid-captured-in-her-bedroom-bondage-struggle-with-tight-tape-gag-full-hd-mp4',
				),
			).toEqual({
				studioId: 28730,
				clipId: 34039699,
				clipSlug:
					'astrid-captured-in-her-bedroom-bondage-struggle-with-tight-tape-gag-full-hd-mp4',
			})
		})

		it('safely parses a clip URL with language and no slug', () => {
			expect(
				safeParseC4SClipUrl('https://clips4sale.com/en/studio/28730/34039699/'),
			).toEqual({
				language: 'en',
				studioId: 28730,
				clipId: 34039699,
			})
		})

		it('returns null for invalid clip URLs', () => {
			expect(safeParseC4SClipUrl('not a url')).toBeNull()
			expect(
				safeParseC4SClipUrl('https://example.com/studio/28730/34039699'),
			).toBeNull()
			expect(
				safeParseC4SClipUrl('https://clips4sale.com/studio/28730'),
			).toBeNull()
			expect(
				safeParseC4SClipUrl('https://clips4sale.com/foo/studio/28730/34039699'),
			).toBeNull()
			expect(
				safeParseC4SClipUrl('https://clips4sale.com/studio/abc/34039699'),
			).toBeNull()
		})

		it('throws an InvalidC4SUrlError for invalid clip URLs', () => {
			expect(() => parseC4SClipUrl('not a url')).toThrow(InvalidC4SUrlError)
		})

		it('returns parsed clip data from the default helper', () => {
			expect(
				parseC4SClipUrl('https://clips4sale.com/en/studio/28730/34039699'),
			).toEqual({
				language: 'en',
				studioId: 28730,
				clipId: 34039699,
			})
		})
	})

	describe('Parses studio info from c4s urls', () => {
		it('safely parses a studio URL with a slug', () => {
			expect(
				safeParseC4SStudioUrl(
					'https://www.clips4sale.com/studio/28730/rf-studio-production',
				),
			).toEqual({
				studioId: 28730,
				studioSlug: 'rf-studio-production',
			})
		})

		it('safely parses a studio URL with language and no slug', () => {
			expect(
				safeParseC4SStudioUrl('https://clips4sale.com/en/studio/28730/'),
			).toEqual({
				language: 'en',
				studioId: 28730,
			})
		})

		it('safely parses studio data from a clip URL', () => {
			expect(
				safeParseC4SStudioUrl(
					'https://www.clips4sale.com/studio/28730/34095879/mandy-blanket-wrapped-and-sock-gagged-for-sensual-foot-tickling-full-hd-mp4',
				),
			).toEqual({
				studioId: 28730,
			})
		})

		it('returns null for invalid studio URLs', () => {
			expect(safeParseC4SStudioUrl('not a url')).toBeNull()
			expect(
				safeParseC4SStudioUrl('https://example.com/studio/28730'),
			).toBeNull()
			expect(
				safeParseC4SStudioUrl(
					'https://clips4sale.com/en/studio/28730/slug/extra',
				),
			).toBeNull()
			expect(
				safeParseC4SStudioUrl('https://clips4sale.com/studio/abc/slug'),
			).toBeNull()
		})

		it('throws an InvalidC4SUrlError for invalid studio URLs', () => {
			expect(() => parseC4SStudioUrl('not a url')).toThrow(InvalidC4SUrlError)
		})

		it('returns parsed studio data from the default helper', () => {
			expect(
				parseC4SStudioUrl(
					'https://clips4sale.com/en/studio/28730/rf-studio-production',
				),
			).toEqual({
				language: 'en',
				studioId: 28730,
				studioSlug: 'rf-studio-production',
			})
		})
	})
})
