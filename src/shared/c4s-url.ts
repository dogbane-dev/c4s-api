import { C4S_LANGUAGES, type C4SLanguage } from './utils'

export type ParsedC4SClipUrl = {
	language?: C4SLanguage
	studioId: number
	clipId: number
	clipSlug?: string
}

export type ParsedC4SStudioUrl = {
	language?: C4SLanguage
	studioId: number
	studioSlug?: string
}

export class InvalidC4SUrlError extends Error {
	constructor(value: string) {
		super(`Invalid Clips4Sale URL: ${value}`)
		this.name = 'InvalidC4SUrlError'
	}
}

const C4S_HOSTNAMES = new Set(['clips4sale.com', 'www.clips4sale.com'])

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

export const safeParseC4SClipUrl = (value: string): ParsedC4SClipUrl | null => {
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

export const parseC4SClipUrl = (value: string): ParsedC4SClipUrl => {
	const parsed = safeParseC4SClipUrl(value)
	if (!parsed) throw new InvalidC4SUrlError(value)
	return parsed
}

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

export const parseC4SStudioUrl = (value: string): ParsedC4SStudioUrl => {
	const parsed = safeParseC4SStudioUrl(value)
	if (!parsed) throw new InvalidC4SUrlError(value)
	return parsed
}
