// Does not get bundled

import { z } from 'zod'
import { createDocument } from 'zod-openapi'
import {
	LANGUAGES,
	SEXUAL_PREFERENCE_MAP,
	STUDIO_CLIPS_PER_PAGE,
	STUDIO_SEARCH_SORTS,
} from '../shared/utils'
import {
	CategoriesResponseSchema,
	CategoryInfoResponseSchema,
	CategorySeeMoreResponseSchema,
	SingleClipResponseSchema,
	SingleStudioResponseSchema,
	StudioClipSearchResponseSchema,
} from './zod'

const clipId = z.number().int().min(1).max(999_999_999).meta({
	description: 'A unique identifier for a clip',
	example: 32348811,
})

const studioId = z.number().int().min(1).max(999_999_999).meta({
	description: 'A unique identifier for a studio',
	example: 220829,
})

const clipSlug = z.string().meta({
	description: 'The text identifier slug for a clip',
	example: '254031',
})

const studioSlug = z.string().meta({
	description: 'The text identifier slug for a studio',
	example: 'something-here',
})

const language = z.enum(LANGUAGES).meta({
	description:
		'The language of the returned data. If omitted, the language will be automatically determined by location of the request.',
	example: 'en',
})

const dataParam = <T extends string>(value: T) =>
	z.literal(value).meta({
		description: `Data loader param. Must be set to "${value}"`,
		example: value,
	})

const studioClipSearchSort = z.enum(STUDIO_SEARCH_SORTS).meta({
	description: 'The sort order of the clip search results',
	example: 'recommended',
})

const page = z.number().int().min(1).max(999_999).meta({
	description: 'Page number',
	example: 1,
})

const onlyClips = z.literal('true').optional().meta({
	description:
		"Whether to return only the studio's clips. If omitted, the response will include studio details. Note: passing any value to this param will be interpreted as true, so passing 'false' as no effect",
	example: 'true',
})

const studioClipSearchCategory = z.number().int().min(0).max(9_999).meta({
	description:
		'The category ID to filter the search by. Setting the value to 0 will filter by all categories.',
	example: 0,
})

const studioClipSearchTerm = z.string().meta({
	description:
		"Search term to filter clip results by. If not provided url should omit '/search/' path param.",
	example: 'ball gag',
})

const category = z.number().int().min(0).max(9_999).meta({
	description: 'C4S category ID',
	example: '4 (Bondage)',
})

const sexualPrefHelpText = Object.entries(SEXUAL_PREFERENCE_MAP)
	.map(([key, value]) => `${value} (ID: ${key})`)
	.join(', ')

const sexualPreferenceOption = z.array(z.number().int().min(1).max(5)).meta({
	description: `Sexual preference option(s) joined by underscores. ${sexualPrefHelpText}`,
	example: '1_2_3_5',
})

const seeMorePage = z.number().int().min(2).max(3).meta({
	description: 'See more category info page number. Can only be 2 or 3.',
})

const seeMoreSection = z
	.enum([
		'top-stores-see-more',
		'top-clips-see-more',
		'recently-added-related-clips-see-more',
	])
	.meta({
		description: 'Determines what type of data is returned',
	})

const schema = createDocument({
	openapi: '3.1.0',
	info: {
		title: 'C4S Unofficial API',
		version: '0.0.1',
	},
	paths: {
		'/{language}/studio/{studioId}/{clipId}/{clipSlug}': {
			get: {
				summary: 'Get clip',
				description: "Get a single clip's full details",
				requestParams: {
					path: z.object({
						studioId,
						clipId,
						clipSlug,
						language,
						// page - undocumented, for recommendations pagination
					}),
					query: z.object({
						_data: dataParam('routes/($lang).studio.$id_.$clipId.$clipSlug'),
					}),
				},
				responses: {
					'200': {
						description: '200 OK',
						content: {
							'text/remix-deferred': { schema: SingleClipResponseSchema },
						},
					},
					'204': {
						description: '204 No Content',
						content: {},
						headers: z.object({
							'x-remix-redirect': z.string(),
							'x-remix-status': z.string(),
						}),
					},
					'403': {
						description: '403 Server Error',
						content: {
							'application/json': {
								schema: z.object({
									message: z.string(),
								}),
							},
						},
					},
				},
			},
		},
		'/{language}/studio/{studioId}/{studioSlug}': {
			get: {
				summary: 'Get studio',
				description: "Get a single studio's full details",
				requestParams: {
					path: z.object({
						studioId,
						studioSlug,
						language,
					}),
					query: z.object({
						_data: dataParam('routes/($lang).studio.$id_.$studioSlug.$'),
					}),
				},
				responses: {
					'200': {
						description: '200 OK',
						content: {
							'text/remix-deferred': { schema: SingleStudioResponseSchema },
						},
					},
					'204': {
						description: '204 No Content',
						content: {},
						headers: z.object({
							'x-remix-redirect': z.string(),
							'x-remix-status': z.string(),
						}),
					},
					// "403": {
					// 	description: "403 Server Error",
					// 	content: {
					// 		"application/json": {
					// 			schema: z.object({
					// 				message: z.string(),
					// 			}),
					// 		},
					// 	},
					// },
				},
			},
		},
		'/{language}/studio/{studioId}/{studioSlug}/{category}/{page}/{sort}/Limit24/search/{search}':
			{
				get: {
					summary: 'Get studio clips',
					description: `Get a paginated list of a studio's clips. Page size is fixed at ${STUDIO_CLIPS_PER_PAGE}, changing limit in url will not have any effect.`,
					requestParams: {
						path: z.object({
							studioId,
							studioSlug,
							language,
							page,
							sort: studioClipSearchSort,
							search: studioClipSearchTerm,
							category: studioClipSearchCategory,
						}),
						query: z.object({
							_data: dataParam('routes/($lang).studio.$id_.$studioSlug.$'),
							onlyClips,
							// storeSimilarClips - undocumented, for similar clips, doesn't seem to work
						}),
					},
					responses: {
						'200': {
							description: '200 OK',
							content: {
								'application/json': { schema: StudioClipSearchResponseSchema },
							},
						},
						'204': {
							description: '204 No Content',
							content: {},
							headers: z.object({
								'x-remix-redirect': z.string(),
								'x-remix-status': z.string(),
							}),
						},
					},
				},
			},
		'/{language}/clips/category/{category}': {
			get: {
				summary: 'Get category details',
				description:
					'Get all category details by ID including top stores and clips, as well as new and trending clips',
				requestParams: {
					path: z.object({
						language,
						category,
					}),
					query: z.object({
						pill: sexualPreferenceOption,
						_data: dataParam('routes/($lang).clips.category.$id.($catName)'),
					}),
				},
				responses: {
					'200': {
						description: '200 OK',
						content: {
							'application/json': { schema: CategoryInfoResponseSchema },
						},
					},
				},
			},
		},
		'/clips/category/seeMore': {
			get: {
				summary: 'Get additional category details',
				description:
					'Get additional category details for a category not returned by category details endpoint. Based on section parameter will return subsequent pages of top stores, top clips, or recently added related clips for this category.',
				requestParams: {
					query: z.object({
						section: seeMoreSection,
						lng: language.optional(),
						id: category,
						page: seeMorePage,
						pill: sexualPreferenceOption,
						_data: dataParam('routes/clips.category.seeMore'),
					}),
				},
				responses: {
					'200': {
						description: '200 OK',
						content: {
							'application/json': { schema: CategorySeeMoreResponseSchema },
						},
					},
				},
			},
		},
		'/clips/ajax/categoriesdropdown': {
			get: {
				summary: 'Get list of categories',
				description: 'Get full list of categories and recommendations',
				requestParams: {
					query: z.object({
						lng: language.optional(),
					}),
				},
				responses: {
					'200': {
						description: '200 OK',
						content: {
							'application/json': { schema: CategoriesResponseSchema },
						},
					},
				},
			},
		},
	},
})

export { schema }
