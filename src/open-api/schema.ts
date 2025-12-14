// Does not get bundled

import { z } from 'zod'
import { createDocument } from 'zod-openapi'
import {
	SingleClipResponseSchema,
	SingleStudioResponseSchema,
	StudioClipSearchResponseSchema,
} from './zod'

// TODO add examples, better notes & descriptions to all schemas
// TODO update README
// TODO official way to add something about response parsing to swagger ?

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

const language = z.enum(['en', 'fr', 'de', 'pt', 'es', 'it']).meta({
	description: 'The language of the clip details',
	example: 'en',
})

const dataParam = <T extends string>(value: T) =>
	z.literal(value).meta({
		description: `Data loader param. Must be set to "${value}"`,
		example: value,
	})

const studioClipSearchSort = z
	.enum([
		'recommended',
		'added_at',
		'most_popular',
		'top_selling',
		'featured',
		'longest',
	])
	.meta({
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

const category = z.number().int().min(0).max(9_999).meta({
	description:
		'The category ID to filter the search by. Setting the value to 0 will filter by all categories.',
	example: 0,
})

const studioClipSearchTerm = z.string().meta({
	description:
		"Search term to filter clip results by. Must start with a '/' character to account for optional path parameter.",
	example: '/ballgag',
})

// ?onlyClips=true&storeSimilarClips=false&_data=routes%2F($lang).studio.$id_.$studioSlug.$

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
					description:
						"Get a paginated list of a studio's clips. Page size is fixed at 20, changing limit in url will not have any effect.",
					requestParams: {
						path: z.object({
							studioId,
							studioSlug,
							language,
							page,
							sort: studioClipSearchSort,
							search: studioClipSearchTerm,
							category,
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
	},
})

export { schema }
