import { describe, expect, it } from 'bun:test'
import {
	SingleClipResponseSchema,
	SingleStudioResponseSchema,
	StudioClipSearchResponseSchema,
} from '../src/open-api/zod'
import {
	type GetC4SCategoryDetailsData,
	type GetC4SClipParams,
	type GetC4SStudioParams,
	getC4SCategoryDetails,
	getC4SClip,
	getC4SStudio,
	getC4SStudioClips,
} from '../src/sdk'
import { formatZodError } from '../src/testing/utils'

const getAndValidateStudio = async (p: GetC4SStudioParams) => {
	const studio = await getC4SStudio(p)
	const parseResult = SingleStudioResponseSchema.safeParse(studio)
	expect(parseResult.success, formatZodError('Studio', parseResult)).toBeTrue()
}

const getAndValidateClip = async (p: GetC4SClipParams) => {
	const clip = await getC4SClip(p)
	const parseResult = SingleClipResponseSchema.safeParse(clip)
	expect(parseResult.success, formatZodError('Clip', parseResult)).toBeTrue()
}

const getTopStores = async () => {
	const { topStores } = await getC4SCategoryDetails({
		id: 4,
	})
	return topStores
}

describe.skipIf(process.env.ROBUST_TESTS !== 'true')(
	'schema robustness',
	async () => {
		let topStores: GetC4SCategoryDetailsData['topStores']

		describe('get studio matches schema - for all top studios', async () => {
			if (!topStores) {
				topStores = await getTopStores()
			}
			for (let i = 0; i < topStores.length; i++) {
				const store = topStores[i]
				const slug = store.storeLink.split('/').at(3)
				expect(slug).toBeString()
				expect(store.storeName).toBeString()
				expect(store.storeId).toBeNumber()

				it(`#${i + 1}. ${store.storeName} (ID = ${store.storeId})`, async () => {
					await getAndValidateStudio({
						id: store.storeId,
						slug: slug,
						language: 'en',
					})
				})
			}
		})

		describe('get clip matches schema - for first 20 clips from random store', async () => {
			if (!topStores) {
				topStores = await getTopStores()
			}
			const randomStore = topStores.at(
				Math.floor(Math.random() * topStores.length),
			)

			expect(randomStore).toBeDefined()
			// biome-ignore lint/style/noNonNullAssertion: asserted above
			const store = randomStore!

			const slug = store.storeLink.split('/').at(3)
			expect(slug).toBeString()
			expect(store.storeName).toBeString()
			expect(store.storeId).toBeNumber()

			const studioClipsResult = await getC4SStudioClips({
				page: 1,
				id: store.storeId,
				slug: slug,
				language: 'en',
				sort: 'added_at',
			})
			const parsedStudioClipsResult =
				StudioClipSearchResponseSchema.safeParse(studioClipsResult)
			expect(
				parsedStudioClipsResult.success,
				formatZodError('Studio clip search response', parsedStudioClipsResult),
			).toBeTrue()

			// biome-ignore lint/style/noNonNullAssertion: asserted above
			const { clips } = parsedStudioClipsResult.data!

			for (let i = 0; i < clips.length; i++) {
				const clip = clips[i]

				it(`#${i + 1}. ${clip.title.slice(0, 30).padEnd(30)} (ID = ${clip.id})`, async () => {
					const clipSlug = clip.bannerLink.split('/').at(4)
					expect(clipSlug).toBeString()
					await getAndValidateClip({
						id: clip.id,
						studioId: store.storeId,
						slug: clipSlug,
						language: 'en',
					})
				})
			}
		})
	},
)
