import { client } from '../client'

const result = await client.GET('/{language}/studio/{studioId}/{studioSlug}', {
	params: {
		path: {
			studioId: 220829,
			studioSlug: 'something-here',
			language: 'en',
		},
		query: {
			_data: 'routes/($lang).studio.$id_.$studioSlug.$',
		},
	},
})

await Bun.file('./debug.json').write(JSON.stringify(result.data, null, 2))
