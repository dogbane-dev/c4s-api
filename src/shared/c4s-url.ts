import { C4SClipNotFoundError } from '../client'
import { C4S_LANGUAGES, type C4SLanguage } from './utils'

type ParsedC4SFullClipUrl = {
	language?: C4SLanguage
	studioId: number
	clipId: number
	clipSlug?: string
}

export type C4SClipUrlParts = ParsedC4SFullClipUrl

type ParsedC4SClipIdOnlyUrl = {
	clipId: number
}

export type ParsedC4SClipUrl = ParsedC4SFullClipUrl | ParsedC4SClipIdOnlyUrl

export type ParsedC4SStudioUrl = {
	language?: C4SLanguage
	studioId: number
	studioSlug?: string
}

/**
 * Error thrown when a value is not a recognized Clips4Sale URL.
 */
export class InvalidC4SUrlError extends Error {
	/**
	 * Creates an invalid Clips4Sale URL error.
	 *
	 * @param value - URL or identifier that could not be parsed.
	 */
	constructor(value: string) {
		super(`Invalid Clips4Sale URL: ${value}`)
		this.name = 'InvalidC4SUrlError'
	}
}

const C4S_HOSTNAMES = new Set(['clips4sale.com', 'www.clips4sale.com'])
const C4S_CLIP_ID_ONLY_HOSTNAMES = new Set([
	't.clips4sale.com',
	'l.clips4sale.com',
])
const C4S_SHORT_CLIP_BASE_URL = 'https://t.clips4sale.com/z/c'
const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308])

const isLanguage = (segment: string): segment is C4SLanguage => {
	return (C4S_LANGUAGES as readonly string[]).includes(segment)
}

const parsePathId = (segment: string | undefined): number | null => {
	if (!segment || !/^\d+$/.test(segment)) return null

	const id = Number(segment)
	return Number.isSafeInteger(id) ? id : null
}

const parseC4SUrlPath = (
	value: string,
): { language?: C4SLanguage; segments: string[] } | null => {
	let url: URL

	try {
		url = new URL(value)
	} catch {
		return null
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
	if (!C4S_HOSTNAMES.has(url.hostname)) return null

	const pathname =
		url.pathname.length > 1 && url.pathname.endsWith('/')
			? url.pathname.slice(0, -1)
			: url.pathname
	const segments = pathname.split('/').slice(1)

	if (segments.length === 0 || segments.some((segment) => segment === '')) {
		return null
	}

	const [firstSegment, ...remainingSegments] = segments
	if (firstSegment && isLanguage(firstSegment)) {
		return { language: firstSegment, segments: remainingSegments }
	}

	return { segments }
}

const parseC4SClipIdOnlyUrl = (
	value: string,
): Pick<ParsedC4SClipUrl, 'clipId'> | null => {
	let url: URL

	try {
		url = new URL(value)
	} catch {
		return null
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
	if (!C4S_CLIP_ID_ONLY_HOSTNAMES.has(url.hostname)) return null

	const pathname =
		url.pathname.length > 1 && url.pathname.endsWith('/')
			? url.pathname.slice(0, -1)
			: url.pathname
	const segments = pathname.split('/').slice(1)

	if (segments.length === 0 || segments.some((segment) => segment === '')) {
		return null
	}

	if (url.hostname === 't.clips4sale.com') {
		const [zRoute, clipRoute, clipIdSegment] = segments
		if (segments.length !== 3 || zRoute !== 'z' || clipRoute !== 'c') {
			return null
		}

		const clipId = parsePathId(clipIdSegment)
		return clipId === null ? null : { clipId }
	}

	if (url.hostname === 'l.clips4sale.com') {
		const [clipRoute, clipIdSegment] = segments
		if (segments.length !== 2 || clipRoute !== 'clip') return null

		const clipId = parsePathId(clipIdSegment)
		return clipId === null ? null : { clipId }
	}

	return null
}

/**
 * Safely parses a Clips4Sale clip URL into its URL parts.
 *
 * @param value - Full Clips4Sale clip URL or supported short clip URL.
 * @returns Parsed clip URL parts, or `null` when the URL is not recognized.
 */
export const safeParseC4SClipUrl = (value: string): ParsedC4SClipUrl | null => {
	const clipIdOnly = parseC4SClipIdOnlyUrl(value)
	if (clipIdOnly) return clipIdOnly

	const parsed = parseC4SUrlPath(value)
	if (!parsed) return null
	if (parsed.segments.length < 3 || parsed.segments.length > 4) return null

	const [route, studioIdSegment, clipIdSegment, clipSlug] = parsed.segments
	if (route !== 'studio') return null

	const studioId = parsePathId(studioIdSegment)
	const clipId = parsePathId(clipIdSegment)
	if (studioId === null || clipId === null) return null

	return {
		...(parsed.language ? { language: parsed.language } : {}),
		studioId,
		clipId,
		...(clipSlug ? { clipSlug } : {}),
	}
}

/**
 * Parses a Clips4Sale clip URL into its URL parts.
 *
 * @param value - Full Clips4Sale clip URL or supported short clip URL.
 * @returns Parsed clip URL parts.
 * @throws InvalidC4SUrlError when the URL is not recognized.
 */
export const parseC4SClipUrl = (value: string): ParsedC4SClipUrl => {
	const parsed = safeParseC4SClipUrl(value)
	if (!parsed) throw new InvalidC4SUrlError(value)
	return parsed
}

/**
 * Resolves a Clips4Sale clip ID to the full clip URL parts by following the
 * Clips4Sale short-link redirect.
 *
 * @param clipId - Clip ID to resolve.
 * @returns Parsed full clip URL parts, including studio ID and clip ID.
 * @throws InvalidC4SUrlError when the ID or redirect target is invalid.
 * @throws C4SClipNotFoundError when Clips4Sale reports that the clip does not exist.
 */
export const getC4SClipUrlFromId = async (
	clipId: number,
): Promise<C4SClipUrlParts> => {
	if (!Number.isSafeInteger(clipId) || clipId < 1) {
		throw new InvalidC4SUrlError(`Bad clip id "${clipId}"`)
	}

	const shortUrl = `${C4S_SHORT_CLIP_BASE_URL}/${clipId}`
	const response = await fetch(shortUrl, {
		redirect: 'manual',
	})

	if (!REDIRECT_STATUS_CODES.has(response.status)) {
		throw new InvalidC4SUrlError(shortUrl)
	}

	const location = response.headers.get('location')
	if (!location) {
		throw new InvalidC4SUrlError(shortUrl)
	}

	// for some reason this is the exact redirect when a clip id DNE using the short base url
	if (location === 'https://www.clips4sale.com/?cflsid=1') {
		throw new C4SClipNotFoundError()
	}

	const parsed = safeParseC4SClipUrl(location)
	if (!parsed || !('studioId' in parsed) || parsed.clipId !== clipId) {
		throw new InvalidC4SUrlError(location)
	}

	return parsed
}

/**
 * Safely parses a Clips4Sale studio URL into its URL parts.
 *
 * @param value - Clips4Sale studio URL, including studio URLs inferred from clip
 * URLs.
 * @returns Parsed studio URL parts, or `null` when the URL is not recognized.
 */
export const safeParseC4SStudioUrl = (
	value: string,
): ParsedC4SStudioUrl | null => {
	const parsed = parseC4SUrlPath(value)
	if (!parsed) return null
	if (parsed.segments.length < 2 || parsed.segments.length > 4) return null

	const [route, studioIdSegment, studioSlugOrClipId] = parsed.segments
	if (route !== 'studio') return null

	const studioId = parsePathId(studioIdSegment)
	if (studioId === null) return null

	const clipId = parsePathId(studioSlugOrClipId)
	const isClipUrl = clipId !== null
	if (parsed.segments.length === 4 && !isClipUrl) return null

	if (isClipUrl) {
		return {
			...(parsed.language ? { language: parsed.language } : {}),
			studioId,
		}
	}

	return {
		...(parsed.language ? { language: parsed.language } : {}),
		studioId,
		...(studioSlugOrClipId ? { studioSlug: studioSlugOrClipId } : {}),
	}
}

/**
 * Parses a Clips4Sale studio URL into its URL parts.
 *
 * @param value - Clips4Sale studio URL, including studio URLs inferred from clip
 * URLs.
 * @returns Parsed studio URL parts.
 * @throws InvalidC4SUrlError when the URL is not recognized.
 */
export const parseC4SStudioUrl = (value: string): ParsedC4SStudioUrl => {
	const parsed = safeParseC4SStudioUrl(value)
	if (!parsed) throw new InvalidC4SUrlError(value)
	return parsed
}
