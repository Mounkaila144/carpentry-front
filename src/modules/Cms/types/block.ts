// Block types for CMS module

import type { BaseQueryParams, SoftDeleteTimestamps } from './common'

// Block type enum
export type BlockType =
  | 'text'
  | 'html'
  | 'hero'
  | 'cta'
  | 'features'
  | 'testimonials'
  | 'gallery'
  | 'video'
  | 'contact'
  | 'faq'
  | 'pricing'
  | 'team'
  | 'stats'
  | 'newsletter'

// Block content types for specific block types
export interface HeroBlockContent {
  title?: string
  subtitle?: string
  button_text?: string
  button_url?: string
  image?: string
  video_url?: string
}

export interface CtaBlockContent {
  title?: string
  description?: string
  button_text?: string
  button_url?: string
}

export interface FeatureItem {
  title: string
  description?: string
  icon?: string
  image?: string
}

export interface FeaturesBlockContent {
  title?: string
  subtitle?: string
  features: FeatureItem[]
}

export interface TestimonialItem {
  name: string
  role?: string
  company?: string
  avatar?: string
  content: string
  rating?: number
}

export interface TestimonialsBlockContent {
  title?: string
  testimonials: TestimonialItem[]
}

export interface GalleryItem {
  image: string
  alt?: string
  caption?: string
}

export interface GalleryBlockContent {
  title?: string
  images: GalleryItem[]
}

export interface VideoBlockContent {
  url: string
  title?: string
  poster?: string
  autoplay?: boolean
}

export interface ContactBlockContent {
  title?: string
  subtitle?: string
  email?: string
  phone?: string
  address?: string
  show_form?: boolean
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqBlockContent {
  title?: string
  items: FaqItem[]
}

export interface PricingPlan {
  name: string
  price: string
  period?: string
  features: string[]
  button_text?: string
  button_url?: string
  is_featured?: boolean
}

export interface PricingBlockContent {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
}

export interface TeamMember {
  name: string
  role: string
  image?: string
  bio?: string
  social?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

export interface TeamBlockContent {
  title?: string
  subtitle?: string
  members: TeamMember[]
}

export interface StatItem {
  value: string
  label: string
  icon?: string
}

export interface StatsBlockContent {
  title?: string
  stats: StatItem[]
}

export interface NewsletterBlockContent {
  title?: string
  subtitle?: string
  button_text?: string
  placeholder?: string
}

export interface TextBlockContent {
  content: string
}

export interface HtmlBlockContent {
  html: string
}

// Union type for all block content types
export type BlockContent =
  | HeroBlockContent
  | CtaBlockContent
  | FeaturesBlockContent
  | TestimonialsBlockContent
  | GalleryBlockContent
  | VideoBlockContent
  | ContactBlockContent
  | FaqBlockContent
  | PricingBlockContent
  | TeamBlockContent
  | StatsBlockContent
  | NewsletterBlockContent
  | TextBlockContent
  | HtmlBlockContent
  | Record<string, unknown>

// Block settings
export interface BlockSettings {
  background_color?: string
  text_color?: string
  padding?: string
  margin?: string
  css_class?: string
  [key: string]: unknown
}

// Block entity
export interface Block extends SoftDeleteTimestamps {
  id: number
  name: string
  identifier: string
  type: BlockType
  content: BlockContent
  settings?: BlockSettings | null
  page_id: number | null
  order: number
  is_active: boolean
}

// Create block request
export interface CreateBlockRequest {
  name: string
  identifier: string
  type: BlockType
  content: BlockContent
  settings?: BlockSettings
  page_id?: number | null
  order?: number
  is_active?: boolean
}

// Update block request
export interface UpdateBlockRequest extends Partial<CreateBlockRequest> {}

// Block query parameters
export interface BlockQueryParams extends BaseQueryParams {
  type?: BlockType
  page_id?: number
}

// Frontend block query parameters
export interface FrontendBlockQueryParams {
  per_page?: number
  type?: BlockType
}

// Reorder block item
export interface ReorderBlockItem {
  id: number
  order: number
}

// Reorder blocks request
export interface ReorderBlocksRequest {
  blocks: ReorderBlockItem[]
}

// Block type info
export interface BlockTypeInfo {
  key: BlockType
  label: string
  description?: string
  icon?: string
}
