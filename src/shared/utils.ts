export const SEXUAL_PREFERENCE_MAP = {
	Straight: 1,
	Gay: 2,
	Lesbian: 3,
	Bisexual: 4,
	Trans: 5,
} as const

export type SexualPreference = keyof typeof SEXUAL_PREFERENCE_MAP

export const LANGUAGES = ['en', 'fr', 'de', 'pt', 'es', 'it'] as const

export type Language = (typeof LANGUAGES)[number]

export const parseSexualPreferences = (
	preferences: SexualPreference[],
): number[] => {
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
] as const

export type StudioSearchSort = (typeof STUDIO_SEARCH_SORTS)[number]

export const VALID_SEE_MORE_PAGES: number[] = [2, 3]
export const INVALID_SEE_MORE_PAGES: number[] = [1, 4]

export const STUDIO_CLIPS_PER_PAGE = 20 // seems to be hard coded in api and cannot be changed
