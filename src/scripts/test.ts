const res = await fetch(
	'https://www.clips4sale.com/en/studio/220829/milaamorabondage/Cat0-AllCategories/Page2/C4SSort-recommended/Limit24/?onlyClips=true&storeSimilarClips=false&_data=routes%2F($lang).studio.$id_.$studioSlug.$',
	{
		headers: {
			Referer: 'https://www.clips4sale.com',
		},
	},
)

const data = await res.json()
console.log(data?.clips?.length)
await Bun.file('./debug.json').write(JSON.stringify(data, null, 2))

export {}
