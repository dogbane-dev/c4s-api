export const SEXUAL_PREFERENCE_MAP = {
	Straight: 1,
	Gay: 2,
	Lesbian: 3,
	Bisexual: 4,
	Trans: 5,
} as const

export type SexualPreference = keyof typeof SEXUAL_PREFERENCE_MAP

export const DEFAULT_SEXUAL_PREFERENCES: number[] = [
	SEXUAL_PREFERENCE_MAP.Straight,
	SEXUAL_PREFERENCE_MAP.Gay,
	SEXUAL_PREFERENCE_MAP.Lesbian,
	SEXUAL_PREFERENCE_MAP.Trans,
]

export const C4S_LANGUAGES = ['en', 'fr', 'de', 'pt', 'es', 'it'] as const

export type C4SLanguage = (typeof C4S_LANGUAGES)[number]

// force undefined to be returned as a Language because path param is technically optional due to request rewrites
/**
 * Normalizes an optional language into the internal path parameter value.
 *
 * @param paramLanguage - Optional Clips4Sale language code.
 * @returns The provided language, or an empty path value typed as a language.
 */
export const parseLanguage = (
	paramLanguage: C4SLanguage | undefined,
): C4SLanguage => {
	return (paramLanguage ?? '') as C4SLanguage
}

// force undefined to be returned as "''" as a number because path param is technically optional due to request rewrites (I manually will fetch studio id)
/**
 * Normalizes an optional studio ID into the internal path parameter value.
 *
 * @param paramStudioId - Optional studio ID.
 * @returns The provided studio ID, or an empty path value typed as a number.
 */
export const parseStudioId = (paramStudioId: number | undefined): number => {
	return (paramStudioId ?? '') as number
}

// default slug is 'x' because slug is technically optional due to redirect handling but something must be passed
/**
 * Normalizes an optional slug into the internal path parameter value.
 *
 * @param paramSlug - Optional Clips4Sale slug.
 * @returns The provided slug, or the placeholder slug used for redirect handling.
 */
export const parseSlug = (paramSlug: string | undefined): string => {
	return paramSlug ?? 'x'
}

/**
 * Converts sexual preference names into Clips4Sale numeric filter IDs.
 *
 * @param preferences - Optional sexual preference names. When omitted, the
 * library default preferences are used.
 * @returns Sorted numeric Clips4Sale sexual preference IDs.
 */
export const parseSexualPreferences = (
	preferences: SexualPreference[] | undefined,
): number[] => {
	if (!preferences) return DEFAULT_SEXUAL_PREFERENCES
	return preferences
		.map((pref) => SEXUAL_PREFERENCE_MAP[pref])
		.sort((a, b) => a - b)
}

export type InferFromField<K extends string, T> = T extends { [k in K]: string }
	? T
	: never

export const STUDIO_SEARCH_SORTS = [
	'recommended',
	'added_at',
	'most_popular',
	'top_selling',
	'featured',
	'longest',
	'display_order_desc',
] as const
export type C4SStudioSearchSort = (typeof STUDIO_SEARCH_SORTS)[number]

const STUDIO_SEARCH_SORT_MAP = {
	recommended: 'recommended',
	'most-recent': 'added_at',
	'most-popular': 'most_popular',
	'top-selling': 'top_selling',
	featured: 'featured',
	longest: 'longest',
	'create-favorites': 'display_order_desc',
} as const
export type StudioSearchSortParam = keyof typeof STUDIO_SEARCH_SORT_MAP

/**
 * Converts a studio clip sort option into the Clips4Sale API sort value.
 *
 * @param sort - Optional public studio search sort option.
 * @returns The Clips4Sale studio search sort value.
 */
export const parseStudioSearchSort = (
	sort: StudioSearchSortParam | undefined,
): C4SStudioSearchSort => {
	return sort ? STUDIO_SEARCH_SORT_MAP[sort] : 'recommended'
}

export const VALID_SEE_MORE_PAGES: number[] = [2, 3]
export const INVALID_SEE_MORE_PAGES: number[] = [1, 4]

export const STUDIO_CLIPS_PER_PAGE = 20 // seems to be hard coded in api and cannot be changed

export const CLIP_SEARCH_SORTS = ['bestmatch', 'mostrecent'] as const
export type SearchC4SSort = (typeof CLIP_SEARCH_SORTS)[number]

const CLIP_SEARCH_SORT_MAP = {
	'most-popular': 'bestmatch',
	'most-recent': 'mostrecent',
} as const

export type ClipSearchSortParam = keyof typeof CLIP_SEARCH_SORT_MAP

/**
 * Converts a clip search sort option into the Clips4Sale API sort value.
 *
 * @param sort - Optional public clip search sort option.
 * @returns The Clips4Sale clip search sort value.
 */
export const parseClipSearchSort = (
	sort: ClipSearchSortParam | undefined,
): SearchC4SSort => {
	return sort ? CLIP_SEARCH_SORT_MAP[sort] : 'bestmatch'
}

export const CLIP_SEARCH_FILTER_DATES = ['24h', '7d', '30d', '1y'] as const
export const CLIP_SEARCH_FILTER_FORMATS = ['avi', 'mp4', 'mov', 'wmv'] as const
export const CLIP_SEARCH_FILTER_RESOLUTIONS = ['4k', 'hd', 'sd'] as const
export const CLIP_SEARCH_FILTER_PRICES = [
	'0_10',
	'10_25',
	'100+',
	'25_50',
	'50_100',
	'on_sale',
] as const
export const CLIP_SEARCH_FILTER_DURATIONS = [
	'0_5',
	'5_10',
	'10_15',
	'15_30',
	'30+',
] as const

export type ClipSearchFilterDate = (typeof CLIP_SEARCH_FILTER_DATES)[number]
export type ClipSearchFilterFormat = (typeof CLIP_SEARCH_FILTER_FORMATS)[number]
export type ClipSearchFilterResolution =
	(typeof CLIP_SEARCH_FILTER_RESOLUTIONS)[number]
export type ClipSearchFilterPrice = (typeof CLIP_SEARCH_FILTER_PRICES)[number]
export type ClipSearchFilterDuration =
	(typeof CLIP_SEARCH_FILTER_DURATIONS)[number]

export type ClipSearchFilter = {
	past?: ClipSearchFilterDate
	format?: ClipSearchFilterFormat | ClipSearchFilterFormat[]
	resolution?: ClipSearchFilterResolution | ClipSearchFilterResolution[]
	sexualPreferences?: SexualPreference | SexualPreference[]
	price?: ClipSearchFilterPrice | ClipSearchFilterPrice[]
	category?: number | number[]
	performer?: number | number[]
}
const filterKeyMap: Record<keyof ClipSearchFilter, string> = {
	past: 'd',
	format: 'f',
	resolution: 'r',
	sexualPreferences: 'o',
	price: 'p',
	category: 'cp',
	performer: 'ap',
}

const FILTER_DELIMITER = '-'
const FILTER_VALUE_DELIMITER = '_and_'

/**
 * Converts public clip search filters into the Clips4Sale path filter string.
 *
 * @param filters - Optional clip search filters for dates, formats,
 * resolutions, sexual preferences, prices, categories, or performers.
 * @returns Encoded Clips4Sale search filter path segment.
 */
export const parseClipSearchFilters = (
	filters: ClipSearchFilter | undefined,
): string => {
	if (!filters) return ''

	const filterStrings: string[] = []

	for (const [k, value] of Object.entries(filters)) {
		const key = k as keyof ClipSearchFilter
		const filterKey = filterKeyMap[key as keyof ClipSearchFilter]
		if (!filterKey || !value) continue

		let values: (string | number)[] = Array.isArray(value) ? value : [value]
		if (key === 'sexualPreferences') {
			values = parseSexualPreferences(values as SexualPreference[])
		}

		// categories & performers are joined by underscores for some reason instead of _and_
		filterStrings.push(
			`${filterKey}${values.join(key === 'category' || key === 'performer' ? '_' : FILTER_VALUE_DELIMITER)}`,
		)
	}

	return filterStrings.join(FILTER_DELIMITER)
}
