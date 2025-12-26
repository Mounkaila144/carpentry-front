// Page types for CMS module

import type { BaseQueryParams, SoftDeleteTimestamps } from './common'

// Page status enum
export type PageStatus = 'draft' | 'published' | 'archived'

// Page template enum
export type PageTemplate = 'default' | 'home' | 'contact' | 'landing' | 'full-width' | 'sidebar'

// Block reference (minimal block info when included in page)
export interface PageBlock {
  id: number
  name: string
  identifier: string
  type: string
  content: Record<string, unknown>
  settings?: Record<string, unknown>
  order: number
  is_active: boolean
}

// Page entity
export interface Page extends SoftDeleteTimestamps {
  id: number
  title: string
  slug: string
  content: string | null
  excerpt?: string | null
  template: PageTemplate
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  featured_image?: string | null
  parent_id: number | null
  status: PageStatus
  order: number
  is_active: boolean
  parent?: Page | null
  children?: Page[]
  blocks?: PageBlock[]
}

// Page tree node (for hierarchical display)
export interface PageTreeNode {
  id: number
  title: string
  slug: string
  template: PageTemplate
  status: PageStatus
  is_active: boolean
  order: number
  children: PageTreeNode[]
}

// Create page request
export interface CreatePageRequest {
  title: string
  slug?: string
  content?: string
  excerpt?: string
  template?: PageTemplate
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  featured_image?: string
  parent_id?: number | null
  status?: PageStatus
  order?: number
  is_active?: boolean
}

// Update page request
export interface UpdatePageRequest extends Partial<CreatePageRequest> {}

// Page query parameters (superadmin)
export interface PageQueryParams extends BaseQueryParams {
  status?: PageStatus
  is_active?: boolean
  parent_id?: number | null
}

// Frontend page query parameters
export interface FrontendPageQueryParams {
  per_page?: number
  template?: PageTemplate
  parent_id?: number | null
}

// Reorder page item
export interface ReorderPageItem {
  id: number
  order: number
  parent_id?: number | null
}

// Reorder pages request
export interface ReorderPagesRequest {
  pages: ReorderPageItem[]
}

// Template info
export interface PageTemplateInfo {
  key: PageTemplate
  label: string
  description?: string
}
