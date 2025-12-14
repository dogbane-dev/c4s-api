/** biome-ignore-all lint/correctness/noUnusedVariables: semi-generated schemas from quicktype */
import * as z from 'zod'

const CanonicalSchema = z.object({
	href: z.string(),
})
type Canonical = z.infer<typeof CanonicalSchema>

const KeywordLinkSchema = z.object({
	keyword: z.string(),
	translations: z.null(),
	link: z.string(),
})
type KeywordLink = z.infer<typeof KeywordLinkSchema>

const AvatarThumbsSchema = z.object({
	avatar_sm: z.string(),
	avatar_md: z.string(),
})
type AvatarThumbs = z.infer<typeof AvatarThumbsSchema>

const BannerThumbsSchema = z.object({
	banner_xlg: z.string(),
	banner_lg: z.string(),
	banner_md: z.string(),
	banner_sm: z.string(),
})
type BannerThumbs = z.infer<typeof BannerThumbsSchema>

const SingleClipMetaSchema = z.object({
	title: z.string(),
	keywords: z.string().nullable(),
	description: z.string(),
	author: z.string(),
	robots: z.null(),
	copyright: z.null(),
	engine: z.string(),
	revision: z.null(),
	image: z.string(),
	image_alt: z.string(),
	location: z.string(),
	og_description: z.string(),
	og_url: z.string(),
	twitter_site: z.string(),
	twitter_card: z.string(),
})
type SingleClipMeta = z.infer<typeof SingleClipMetaSchema>

const PillSchema = z.object({
	value: z.number(),
	label: z.string(),
	type: z.string(),
	isActive: z.boolean(),
})
type Pill = z.infer<typeof PillSchema>

const RecommendationStudioSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	avatar: z.null(),
	avatar_thumbs: z.null(),
	banner: z.null(),
	banner_thumbs: z.null(),
	total_clips: z.null(),
	last_clip: z.null(),
	most_recent_clip_id: z.null(),
	link: z.string(),
	category: z.null(),
})
type RecommendationStudio = z.infer<typeof RecommendationStudioSchema>

const StudioCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	translations: z.null(),
	link: z.string(),
	search_link: z.string(),
	store_link: z.null(),
	clean_name: z.string(),
	total_clips: z.null(),
	thumb: z.null(),
	pill: z.null(),
})
type StudioCategory = z.infer<typeof StudioCategorySchema>

const ClipStudioSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	avatar: z.string().nullable(),
	avatar_thumbs: AvatarThumbsSchema.nullable(),
	banner: z.string().nullable(),
	banner_thumbs: BannerThumbsSchema.nullable(),
	total_clips: z.number().nullable(),
	last_clip: z.null(),
	most_recent_clip_id: z.number().nullable(),
	link: z.string(),
	category: z.null(),
})
type ClipStudio = z.infer<typeof ClipStudioSchema>

export const SrcsetSchema = z.object({
	srcSet: z.string(),
	media: z.number(),
})
export type Srcset = z.infer<typeof SrcsetSchema>

export const PerformerSchema = z.object({
	id: z.number(),
	stage_name: z.string(),
	total_clips: z.null(),
	avatars: z.null(),
	created_at: z.null(),
})
export type Performer = z.infer<typeof PerformerSchema>

const RecommendationSchema = z.object({
	clipId: z.string(),
	producer: z.number(),
	bannerLink: z.string(),
	title: z.string(),
	position: z.number(),
	categoryId: z.number(),
	duration: z.number(),
	suggestedClipUrl: z.string(),
	previewLink: z.string(),
	previewUrl: z.null(),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string().nullable(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	dateDisplay: z.string(),
	recommendationsQueryId: z.string(),
	scroll_page: z.number(),
	screen_size: z.null(),
	id: z.number(),
	checkout_link: z.string(),
	date_display: z.string(),
	cdn_preview_link: z.string().nullable(),
	is_preview_enabled: z.boolean(),
	cdn_previewlg_link: z.string(),
	link: z.string(),
	format: z.null(),
	resolution_text: z.null(),
	resolution: z.null(),
	time_minutes: z.number(),
	size_mb: z.null(),
	size: z.null(),
	category_link: z.string(),
	category_name: z.string(),
	performers: z.array(PerformerSchema).nullable(),
	description: z.null(),
	description_sanitized: z.null(),
	translations: z.null(),
	studio: RecommendationStudioSchema,
	gifPreviewUrl: z.null(),
	discounted_price: z.null(),
	onSale: z.null(),
	isAudio: z.boolean(),
})
type Recommendation = z.infer<typeof RecommendationSchema>

export const RelatedCategoryLinkSchema = z.object({
	category: z.string(),
	translations: z.null().optional(),
	link: z.string(),
})
export type RelatedCategoryLink = z.infer<typeof RelatedCategoryLinkSchema>

const ClipSchema = z.object({
	clipId: z.string(),
	producer: z.number(),
	bannerLink: z.string(),
	title: z.string(),
	position: z.number(),
	categoryId: z.number(),
	duration: z.number(),
	suggestedClipUrl: z.string(),
	previewLink: z.string(),
	previewUrl: z.null(),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	dateDisplay: z.string(),
	scroll_page: z.number(),
	screen_size: z.string(),
	id: z.number(),
	checkout_link: z.string(),
	date_display: z.string(),
	cdn_preview_link: z.string(),
	is_preview_enabled: z.boolean(),
	cdn_previewlg_link: z.string(),
	link: z.string(),
	format: z.string(),
	resolution_text: z.string(),
	resolution: z.string(),
	time_minutes: z.number(),
	size_mb: z.number(),
	size: z.number(),
	category_link: z.string(),
	category_name: z.string(),
	related_category_links: z.array(RelatedCategoryLinkSchema),
	keyword_links: z.array(KeywordLinkSchema),
	performers: z.array(PerformerSchema).nullable(),
	description: z.string(),
	description_sanitized: z.string(),
	translations: z.null(),
	studio: ClipStudioSchema,
	gifPreviewUrl: z.null(),
	discounted_price: z.null(),
	onSale: z.null(),
	isAudio: z.boolean(),
})
type Clip = z.infer<typeof ClipSchema>

const RecommendationsPromiseSchema = z.object({
	recommendations: z.array(RecommendationSchema),
	pills: z.array(PillSchema),
})
type RecommendationsPromise = z.infer<typeof RecommendationsPromiseSchema>

export const SingleClipResponseSchema = z.object({
	studioId: z.string(),
	clipId: z.string(),
	clipSlug: z.string(),
	ga_tracking_id: z.null(),
	recommendationsPromise: RecommendationsPromiseSchema,
	clipIsUnavailable: z.boolean(),
	visibility_mode: z.string(),
	store_status: z.string(),
	hideStoreAvatar: z.boolean(),
	store_has_clips: z.boolean(),
	similarStoreClips: z.array(z.any()),
	studioSlug: z.string(),
	clip: ClipSchema,
	followersCount: z.number(),
	clipsCount: z.number(),
	studioCategories: z.array(StudioCategorySchema),
	nextLink: z.string(),
	prevLink: z.string(),
	meta: SingleClipMetaSchema,
	canonical: CanonicalSchema,
})
type SingleClipResponse = z.infer<typeof SingleClipResponseSchema>

// ------------

export const SingleStudioResponseCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string(),
})
export type SingleStudioResponseCategory = z.infer<
	typeof SingleStudioResponseCategorySchema
>

export const StudioSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	avatar: z.null(),
	avatar_thumbs: z.null(),
	banner: z.null(),
	banner_thumbs: z.null(),
	total_clips: z.null(),
	last_clip: z.null(),
	most_recent_clip_id: z.null(),
	link: z.string(),
	category: z.null(),
})
export type Studio = z.infer<typeof StudioSchema>

export const SingleStudioMetaSchema = z.object({
	title: z.string(),
	keywords: z.string().nullable(),
	description: z.string(),
	author: z.string(),
	robots: z.null(),
	copyright: z.string(),
	engine: z.string(),
	revision: z.null(),
	image: z.string(),
	image_alt: z.string(),
	location: z.string(),
	og_description: z.string(),
	og_url: z.string(),
	twitter_site: z.string(),
	twitter_card: z.string(),
	language: z.string(),
})
export type SingleStudioMeta = z.infer<typeof SingleStudioMetaSchema>

export const OtherStudioCategorySchema = z.object({
	category: z.string(),
	id: z.number(),
	name: z.string(),
	translations: z.null(),
	link: z.string(),
	search_link: z.string(),
	store_link: z.null(),
	clean_name: z.string(),
	total_clips: z.null(),
	thumb: z.null(),
	pill: z.null(),
})
export type OtherStudioCategory = z.infer<typeof OtherStudioCategorySchema>

export const SocialLinkSchema = z.object({
	title: z.string(),
	url: z.string(),
})
export type SocialLink = z.infer<typeof SocialLinkSchema>

export const SortOptionSchema = z.object({
	label: z.string(),
	value: z.string(),
})
export type SortOption = z.infer<typeof SortOptionSchema>

export const StudioClipSchema = z.object({
	clipId: z.string(),
	producer: z.number(),
	bannerLink: z.string(),
	title: z.string(),
	position: z.number(),
	categoryId: z.number(),
	duration: z.number(),
	suggestedClipUrl: z.string(),
	previewLink: z.string(),
	previewUrl: z.union([z.null(), z.string()]),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	dateDisplay: z.string(),
	searchQueryId: z.string(),
	scroll_page: z.number(),
	screen_size: z.string(),
	id: z.number(),
	checkout_link: z.string(),
	date_display: z.string(),
	cdn_preview_link: z.string(),
	is_preview_enabled: z.boolean(),
	cdn_previewlg_link: z.string(),
	link: z.string(),
	format: z.string(),
	resolution_text: z.string(),
	resolution: z.string(),
	time_minutes: z.number(),
	size_mb: z.number(),
	size: z.number(),
	category_link: z.string(),
	category_name: z.string(),
	related_category_links: z.array(RelatedCategoryLinkSchema),
	keyword_links: z.array(KeywordLinkSchema),
	performers: z.array(PerformerSchema).nullable(),
	description: z.string(),
	description_sanitized: z.string(),
	translations: z.null(),
	studio: StudioSchema,
	gifPreviewUrl: z.union([z.null(), z.string()]),
	discounted_price: z.null(),
	onSale: z.null(),
	isAudio: z.boolean(),
})
export type StudioClip = z.infer<typeof StudioClipSchema>

export const OtherStudioSchema = z.object({
	avatarSrc: z.string(),
	title: z.string(),
	link: z.string(),
	id: z.number(),
	categories: z.array(OtherStudioCategorySchema),
})
export type OtherStudio = z.infer<typeof OtherStudioSchema>

export const SingleStudioResponseSchema = z.object({
	onSaleClips: z.array(ClipSchema),
	clips: z.array(ClipSchema),

	ga_tracking_id: z.null(),
	avatarSrc: z.string(),
	bannerSrc: z.string(),
	store_has_clips: z.boolean(),
	browseSimilarClipsLink: z.string(),

	classicWidgetExperimentActive: z.boolean(),
	similarStoreClips: z.array(z.any()),
	bannerSrcset: z.array(SrcsetSchema),
	description: z.string(),
	clipsCount: z.number(),
	clipsOutsideOrientationCount: z.number(),
	followersCount: z.number(),
	title: z.string(),
	page: z.number(),
	studioId: z.string(),
	studioSlug: z.string(),
	view: z.string(),
	categoryId: z.string(),
	socialLinks: z.array(SocialLinkSchema),
	donate: z.boolean(),
	tribute: z.boolean(),
	canBeFollowed: z.boolean(),
	otherStudios: z.array(OtherStudioSchema).optional(),
	categories: z.array(SingleStudioResponseCategorySchema),
	meta: SingleStudioMetaSchema,
	clipsSort: z.string(),
	sortOptions: z.array(SortOptionSchema),
	storeDefaultSorting: z.string(),
	canonical: CanonicalSchema,
	selectedOrientations: z.array(z.number()),
	isContentPreferenceLGBT: z.boolean(),
	isChatEnabled: z.boolean(),
	isCreatorOnline: z.boolean(),
	visibility_mode: z.string(),
	store_status: z.string(),
})
export type SingleStudioResponse = z.infer<typeof SingleStudioResponseSchema>

// ------------

export const CategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string(),
})
export type Category = z.infer<typeof CategorySchema>

export const StudioClipSearchMetaSchema = z.object({
	title: z.string(),
	keywords: z.null(),
	description: z.string(),
	author: z.string(),
	robots: z.null(),
	copyright: z.string(),
	engine: z.string(),
	revision: z.null(),
	image: z.string(),
	image_alt: z.string(),
	location: z.string(),
	og_description: z.string(),
	og_url: z.string(),
	twitter_site: z.string(),
	twitter_card: z.string(),
	language: z.string(),
	keyword: z.string().optional(),
})
export type StudioSearchMeta = z.infer<typeof StudioClipSearchMetaSchema>

export const StudioSearchClipSchema = z.object({
	clipId: z.string(),
	producer: z.number(),
	bannerLink: z.string(),
	title: z.string(),
	position: z.number(),
	categoryId: z.number(),
	duration: z.number(),
	suggestedClipUrl: z.string(),
	previewLink: z.string(),
	previewUrl: z.null(),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	dateDisplay: z.string(),
	searchQueryId: z.string(),
	scroll_page: z.number(),
	screen_size: z.string(),
	id: z.number(),
	checkout_link: z.string(),
	date_display: z.string(),
	cdn_preview_link: z.string(),
	is_preview_enabled: z.boolean(),
	cdn_previewlg_link: z.string(),
	link: z.string(),
	format: z.string(),
	resolution_text: z.string(),
	resolution: z.string(),
	time_minutes: z.number(),
	size_mb: z.number(),
	size: z.number(),
	category_link: z.string(),
	category_name: z.string(),
	related_category_links: z.array(RelatedCategoryLinkSchema),
	keyword_links: z.array(KeywordLinkSchema),
	performers: z.array(PerformerSchema).nullable(),
	description: z.string(),
	description_sanitized: z.string(),
	translations: z.null(),
	studio: StudioSchema,
	gifPreviewUrl: z.null(),
	discounted_price: z.null(),
	onSale: z.null(),
	isAudio: z.boolean(),
})
export type StudioSearchClip = z.infer<typeof StudioSearchClipSchema>

const BaseStudioClipSearchResponseSchema = z.object({
	clips: z.array(StudioSearchClipSchema),
	onSaleClips: z.array(StudioSearchClipSchema),
})

export const StudioClipSearchResponseSchema =
	BaseStudioClipSearchResponseSchema.and(
		z
			.object({
				ga_tracking_id: z.null(),
				avatarSrc: z.string(),
				bannerSrc: z.string(),
				store_has_clips: z.boolean(),
				browseSimilarClipsLink: z.string(),
				classicWidgetExperimentActive: z.boolean(),
				similarStoreClips: z.array(z.any()),
				bannerSrcset: z.array(SrcsetSchema),
				description: z.string(),
				clipsCount: z.number(),
				clipsOutsideOrientationCount: z.number(),
				followersCount: z.number(),
				title: z.string(),
				page: z.number(),
				studioId: z.string(),
				studioSlug: z.string(),
				view: z.string(),
				keyword: z.string(),
				socialLinks: z.array(SocialLinkSchema),
				donate: z.boolean(),
				tribute: z.boolean(),
				canBeFollowed: z.boolean(),
				categories: z.array(CategorySchema),
				meta: StudioClipSearchMetaSchema,
				clipsSort: z.string(),
				sortOptions: z.array(SortOptionSchema),
				storeDefaultSorting: z.string(),
				canonical: CanonicalSchema,
				selectedOrientations: z.array(z.number()),
				isContentPreferenceLGBT: z.boolean(),
				isChatEnabled: z.boolean(),
				isCreatorOnline: z.boolean(),
				visibility_mode: z.string(),
				store_status: z.string(),
			})
			.partial(),
	)

export type StudioClipSearchResponse = z.infer<
	typeof StudioClipSearchResponseSchema
>
