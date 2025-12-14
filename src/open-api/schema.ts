// Does not get bundled

import { z } from 'zod'
import { createDocument } from 'zod-openapi'
import { SingleClipResponseSchema, SingleStudioResponseSchema } from './zod'

// TODO add open add examples

const clipId = z.number().int().meta({
	description: 'A unique identifier for a clip',
	example: 32348811,
})

const studioId = z.number().int().meta({
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

// studio clips ?
// url: `https://www.clips4sale.com/en/studio/${sid}/${slug}/Cat0-AllCategories/Page${clipPage}/C4SSort-added_at/Limit24`,
// params: {
//   _data: "routes/($lang).studio.$id_.$studioSlug.$",
//   onlyClips: "true",
// },

const schema = createDocument({
	openapi: '3.1.0',
	info: {
		title: 'C4S Unofficial API',
		version: '0.0.1',
	},
	paths: {
		'/{language}/studio/{studioId}/{clipId}/{clipSlug}': {
			get: {
				description: 'Get a single clip details',
				summary: 'summary here',
				requestParams: {
					path: z.object({
						studioId,
						clipId,
						clipSlug,
						language,
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
				description: "Get a single studio's details",
				summary: 'summary here',
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
	},
})

export { schema }
