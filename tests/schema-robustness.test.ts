// import {
// 	SingleClipResponseSchema,
// 	SingleStudioResponseSchema,
// } from '../src/open-api/zod'
// import {
// 	type GetC4SClipParams,
// 	type GetC4SStudioParams,
// 	getC4SCategoryDetails,
// 	getC4SClip,
// 	getC4SStudio,
// } from '../src/sdk'
// import { formatZodError } from '../src/testing/utils'

// const getAndValidateStudio = async (p: GetC4SStudioParams) => {
// 	const studio = await getC4SStudio(p)

// 	const parseResult = SingleStudioResponseSchema.safeParse(studio)
// 	if (!parseResult.success) {
// 		throw new Error(formatZodError('Studio', parseResult))
// 	}
// 	return parseResult.data
// }

// const getAndValidateClip = async (p: GetC4SClipParams) => {
// 	const clip = await getC4SClip(p)
// 	const parseResult = SingleClipResponseSchema.safeParse(clip)
// 	if (!parseResult.success) {
// 		throw new Error(formatZodError('Clip', parseResult))
// 	}
// 	return parseResult.data
// }

// const { topStores } = await getC4SCategoryDetails({
// 	category: 4,
// })

// const startAtStore = 0

// for (let i = startAtStore; i < topStores.length; i++) {
// 	const store = topStores[i]
// 	const slug = store.storeLink.split('/').at(3)
// 	if (!slug) continue
// 	console.log(`(#${i + 1}) [${store.storeId}] ${store.storeName}`)

// 	const studio = await getAndValidateStudio({
// 		studioId: store.storeId,
// 		studioSlug: slug,
// 		language: 'en',
// 	})

// 	// const parseResult = SingleStudioResponseSchema.safeParse(studio)

// 	// if (!parseResult.success) {
// 	// 	console.error(formatZodError('Single Studio', parseResult))
// 	// 	break
// 	// }

// 	for (let j = 0; j < studio.clips.length; j++) {
// 		const clip = studio.clips[j]
// 		const clipSlug = clip.bannerLink.split('/').at(4)

// 		console.log(
// 			`  (#${i + 1}-${j + 1}) [${clip.id}] ${clip.title.slice(0, 50)}`,
// 		)

// 		await getAndValidateClip({
// 			clipId: clip.id,
// 			studioId: store.storeId,
// 			language: 'en',
// 			clipSlug: clipSlug,
// 		})
// 	}
// }

// describe('categories', () => {
// 	it('fetches', async () => {

// 	})
// })
