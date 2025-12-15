/** biome-ignore-all lint/correctness/noUnusedVariables: semi-generated schemas from quick-type */
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
	og_description: z.string().nullable(),
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

const CategoryInfoSchema = z.object({
	id: z.number(),
	name: z.string(),
	translations: z.null(),
	link: z.string(),
	search_link: z.string(),
	store_link: z.string().nullable(),
	clean_name: z.string(),
	total_clips: z.null(),
	thumb: z.null(),
	pill: z.null(),
})

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
	previewUrl: z.string().nullable(),
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
	description: z.string().nullable(),
	description_sanitized: z.string().nullable(),
	translations: z.null(),
	studio: RecommendationStudioSchema,
	gifPreviewUrl: z.string().nullable(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	onSale: z.boolean().nullable(),
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
	previewUrl: z.string().nullable(),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string().nullable(),
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
	related_category_links: z.array(RelatedCategoryLinkSchema).optional(),
	keyword_links: z.array(KeywordLinkSchema),
	performers: z.array(PerformerSchema).nullable(),
	description: z.string().nullable(),
	description_sanitized: z.string().nullable(),
	translations: z.null(),
	studio: ClipStudioSchema,
	gifPreviewUrl: z.string().nullable(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	onSale: z.boolean().nullable(),
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
	ga_tracking_id: z.string().nullable(),
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
	studioCategories: z.array(CategoryInfoSchema),
	nextLink: z.string(),
	prevLink: z.string().nullable(),
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
	description: z.string().nullable(),
	author: z.string(),
	robots: z.null(),
	copyright: z.string(),
	engine: z.string(),
	revision: z.null(),
	image: z.string(),
	image_alt: z.string(),
	location: z.string(),
	og_description: z.string().nullable().nullable(),
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
	previewUrl: z.string().nullable(),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string().nullable(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	dateDisplay: z.string(),
	searchQueryId: z.string().optional(),
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
	related_category_links: z.array(RelatedCategoryLinkSchema).optional(),
	keyword_links: z.array(KeywordLinkSchema),
	performers: z.array(PerformerSchema).nullable(),
	description: z.string().nullable(),
	description_sanitized: z.string().nullable(),
	translations: z.null(),
	studio: StudioSchema,
	gifPreviewUrl: z.string().nullable(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	onSale: z.boolean().nullable(),
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

	ga_tracking_id: z.string().nullable(),
	avatarSrc: z.string(),
	bannerSrc: z.string().optional(),
	store_has_clips: z.boolean(),
	browseSimilarClipsLink: z.string(),

	classicWidgetExperimentActive: z.boolean(),
	similarStoreClips: z.array(z.any()),
	bannerSrcset: z.array(SrcsetSchema),
	description: z.string().nullable(),
	clipsCount: z.number(),
	clipsOutsideOrientationCount: z.number(),
	followersCount: z.number(),
	title: z.string(),
	page: z.number(),
	studioId: z.string(),
	studioSlug: z.string(),
	view: z.string(),
	categoryId: z.string(),
	socialLinks: z.array(SocialLinkSchema).nullable(),
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

export const BaseCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string(),
})
export type BaseCategory = z.infer<typeof BaseCategorySchema>

export const StudioClipSearchMetaSchema = z.object({
	title: z.string(),
	keywords: z.string().nullable(),
	description: z.string().nullable(),
	author: z.string(),
	robots: z.null(),
	copyright: z.string(),
	engine: z.string(),
	revision: z.null(),
	image: z.string(),
	image_alt: z.string(),
	location: z.string(),
	og_description: z.string().nullable(),
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
	previewUrl: z.string().nullable(),
	srcSet: z.string(),
	responsiveSrcset: z.array(SrcsetSchema),
	customPreview: z.boolean(),
	customPreviewUrl: z.string().nullable(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	dateDisplay: z.string(),
	searchQueryId: z.string().optional(),
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
	related_category_links: z.array(RelatedCategoryLinkSchema).optional(),
	keyword_links: z.array(KeywordLinkSchema),
	performers: z.array(PerformerSchema).nullable(),
	description: z.string().nullable(),
	description_sanitized: z.string().nullable(),
	translations: z.null(),
	studio: StudioSchema,
	gifPreviewUrl: z.string().nullable(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	onSale: z.boolean().nullable(),
	isAudio: z.boolean(),
})
export type StudioSearchClip = z.infer<typeof StudioSearchClipSchema>

const BaseStudioClipSearchResponseSchema = z.object({
	clips: z.array(StudioSearchClipSchema),
	onSaleClips: z.array(StudioSearchClipSchema),
})

export const StudioClipSearchResponseSchema =
	BaseStudioClipSearchResponseSchema.and(
		// these fields are all optional because when onlyClips is true, the response will not include studio details
		z
			.object({
				ga_tracking_id: z.string().nullable(),
				avatarSrc: z.string(),
				bannerSrc: z.string(),
				store_has_clips: z.boolean(),
				browseSimilarClipsLink: z.string(),
				classicWidgetExperimentActive: z.boolean(),
				similarStoreClips: z.array(z.any()),
				bannerSrcset: z.array(SrcsetSchema),
				description: z.string().nullable(),
				clipsCount: z.number(),
				clipsOutsideOrientationCount: z.number(),
				followersCount: z.number(),
				title: z.string(),
				page: z.number(),
				studioId: z.string(),
				studioSlug: z.string(),
				view: z.string(),
				keyword: z.string(),
				socialLinks: z.array(SocialLinkSchema).nullable(),
				donate: z.boolean(),
				tribute: z.boolean(),
				canBeFollowed: z.boolean(),
				categories: z.array(BaseCategorySchema),
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

// -----

export const MetaDataSchema = z.object({
	meta_title: z.string().nullable(),
	meta_description: z.string().nullable(),
	header_one: z.null(),
	header_two: z.null(),
	header_three: z.null(),
})
export type MetaData = z.infer<typeof MetaDataSchema>

export const CategoryInfoMetaSchema = z.object({
	title: z.string(),
	keywords: z.string(),
	description: z.string(),
	author: z.string(),
	robots: z.null(),
	copyright: z.string(),
	engine: z.string(),
	revision: z.string(),
	image: z.null(),
	image_alt: z.null(),
	location: z.null(),
	og_description: z.string().nullable().nullable(),
	og_url: z.null(),
	twitter_site: z.null(),
	twitter_card: z.null(),
})
export type CategoryInfoMeta = z.infer<typeof CategoryInfoMetaSchema>

export const StoreSchema = z.object({
	storeId: z.number(),
	avatarSrc: z.string(),
	avatarLink: z.string(),
	storeName: z.string(),
	storeLink: z.string(),
	storeCategory: z.string(),
	storeCategoryLink: z.string(),
	storeFilteredByCategoryLink: z.string(),
	latestClipPreview: z.string(),
	latestClipPreviewLink: z.string(),
	latestClipCategory: z.string(),
	latestClipCategoryId: z.number(),
	latestClipUpdate: z.string(),
	totalClips: z.number(),
})
export type Store = z.infer<typeof StoreSchema>

export const CategoryClipSchema = z.object({
	clipId: z.number(),
	producer: z.number(),
	bannerLink: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	translations: z.null(),
	categoryId: z.number(),
	categoryName: z.string(),
	categoryLink: z.string(),
	duration: z.number(),
	suggestedClipUrl: z.string(),
	previewLink: z.string(),
	srcSet: z.string(),
	previewUrl: z.string(),
	customPreview: z.boolean(),
	customPreviewUrl: z.string().nullable(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	queryId: z.string(),
	isSuggestedWishlist: z.boolean(),
	onSale: z.boolean().nullable(),
})
export type CategoryClip = z.infer<typeof CategoryClipSchema>

export const RelatedCategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	categoryLink: z.string(),
	thumb: z.string(),
	totalClips: z.number(),
})
export type RelatedCategory = z.infer<typeof RelatedCategorySchema>

export const OutsideOrientationSchema = z.object({
	stores: z.number(),
	clips: z.number(),
})
export type OutsideOrientation = z.infer<typeof OutsideOrientationSchema>

export const TrendingRetroClipSchema = z.object({
	clipId: z.number(),
	producer: z.number(),
	bannerLink: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	translations: z.null(),
	categoryId: z.number(),
	categoryName: z.string(),
	categoryLink: z.string(),
	duration: z.number(),
	suggestedClipUrl: z.string(),
	previewLink: z.string(),
	srcSet: z.string(),
	previewUrl: z.string(),
	customPreview: z.boolean(),
	customPreviewUrl: z.string().nullable(),
	studioTitle: z.string(),
	studioLink: z.string(),
	price: z.number(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	queryId: z.string(),
	isSuggestedWishlist: z.boolean(),
	onSale: z.boolean().nullable(),
})
export type TrendingRetroClip = z.infer<typeof TrendingRetroClipSchema>

export const TopSchema = z.object({
	content: z.string(),
	font_size: z.string(),
	font_color: z.string(),
	is_html: z.boolean(),
	category: CategoryInfoSchema,
	meta_data: MetaDataSchema,
})
export type Top = z.infer<typeof TopSchema>

export const TotalsSchema = z.object({
	stores: z.number(),
	clips: z.number(),
	outside_orientation: OutsideOrientationSchema,
})
export type Totals = z.infer<typeof TotalsSchema>

export const DescriptionSchema = z.object({
	top: TopSchema,
	bottom: z.null(),
})
export type Description = z.infer<typeof DescriptionSchema>

export const CategoryInfoResponseSchema = z.object({
	meta: CategoryInfoMetaSchema,
	totals: TotalsSchema,
	description: DescriptionSchema,
	category: CategoryInfoSchema,
	topStores: z.array(StoreSchema),
	newStores: z.array(StoreSchema),
	relatedCategories: z.array(RelatedCategorySchema),
	recentlyAddedCategoryClips: z.array(CategoryClipSchema),
	trendingRetroClips: z.array(TrendingRetroClipSchema),
	recentlyAddedRelatedClips: z.array(CategoryClipSchema),
	topClips: z.array(CategoryClipSchema),
	id: z.string(),
	canonical: CanonicalSchema,
	selectedOrientations: z.array(z.number()),
	isContentPreferenceLGBT: z.boolean(),
	contentPreferencePills: z.array(z.string()),
	categoryAvailablePreferencePills: z.array(z.number()),
	isAgeVerificationRequired: z.boolean(),
	hrefLang: CanonicalSchema,
})
export type CategoryInfoResponse = z.infer<typeof CategoryInfoResponseSchema>

export const ThumbsSchema = z.object({
	square_sm: z.string(),
	square_md: z.string(),
	rect_sm: z.string(),
	rect_md: z.string(),
	rect_lrg: z.string(),
	rect_ex_lrg: z.string(),
})
export type Thumbs = z.infer<typeof ThumbsSchema>

export const LastClipSchema = z.object({
	id: z.number(),
	added_at: z.string(),
	category: BaseCategorySchema,
	thumbs: ThumbsSchema,
})
export type LastClip = z.infer<typeof LastClipSchema>

export const SeeMoreExtraStoreSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	avatar: z.string(),
	avatar_thumbs: AvatarThumbsSchema,
	banner: z.null(),
	banner_thumbs: z.null(),
	total_clips: z.number(),
	last_clip: LastClipSchema,
	most_recent_clip_id: z.null(),
	link: z.string(),
	category: CategoryInfoSchema,
})
export type SeeMoreExtraStore = z.infer<typeof SeeMoreExtraStoreSchema>

export const SeeMoreExtraClipSchema = z.object({
	id: z.number(),
	title: z.string(),
	slug: z.string(),
	link: z.string(),
	related_categories: z.null(),
	related_keywords: z.null(),
	description: z.string().nullable(),
	description_sanitized: z.string().nullable(),
	translations: z.null(),
	added_at: z.string(),
	price: z.number(),
	discounted_price: z
		.object({
			name: z.string().nullable(),
			id: z.null(),
			sale_type: z.string(),
			percent: z.number(),
			tiers: z.null(),
			discount: z.number(),
		})
		.nullable(),
	format: z.null(),
	screen: z.null(),
	resolution: z.null(),
	length: z.number(),
	suggested_clip_url: z.string(),
	size: z.null(),
	studio: StudioSchema,
	category: CategoryInfoSchema,
	thumb: z.string(),
	thumbs: ThumbsSchema,
	mediabook_url: z.null(),
	mediabook_quality: z.null(),
	video_preview_link: z.string(),
	cdn_previewlg_link: z.string(),
	cdn_preview_link: z.string(),
	checkout_link: z.string(),
	next_link: z.null(),
	prev_link: z.null(),
	show_click_for_preview: z.boolean(),
	webm_preview_link: z.string().nullable(),
	gif_preview_link: z.string().nullable(),
	download: z.null(),
	is_encoded: z.null(),
	player: z.null(),
	orientation: z.null(),
	performers: z.union([z.array(PerformerSchema), z.null()]),
	archived: z.boolean(),
	on_sale: z.null(),
})
export type SeeMoreExtraClip = z.infer<typeof SeeMoreExtraClipSchema>

export const SeeMoreResponseSchema = z.object({
	seeMoreExtra: z.union([
		z.array(SeeMoreExtraStoreSchema),
		z.array(SeeMoreExtraClipSchema),
	]),
})
export type SeeMoreResponse = z.infer<typeof SeeMoreResponseSchema>

export const CategorySchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string(),
	search_link: z.string(),
	pill: z.number().nullable(),
})
export type Category = z.infer<typeof CategorySchema>

export const CategoriesResponseSchema = z.object({
	success: z.boolean(),
	code: z.string(),
	categories: z.array(CategorySchema),
	recommendations: z.array(CategorySchema),
})
export type CategoeriesResponse = z.infer<typeof CategoriesResponseSchema>
