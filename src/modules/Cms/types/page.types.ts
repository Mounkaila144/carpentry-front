/**
 * CMS Page Types
 * Based on API documentation
 */

export type PageStatus = 'draft' | 'published' | 'archived'
export type PageTemplate = 'default' | 'home' | 'contact' | 'landing' | 'full-width' | 'sidebar'

export interface Page {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  template: PageTemplate
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  featured_image?: string
  parent_id?: number | null
  status: PageStatus
  order: number
  is_active: boolean
  parent?: Page | null
  children?: Page[]
  blocks?: any[]
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CreatePagePayload {
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

export interface UpdatePagePayload extends Partial<CreatePagePayload> {}

export interface PageQueryParams {
  page?: number
  per_page?: number
  search?: string
  status?: PageStatus
  is_active?: boolean
  parent_id?: number | null
}

export interface PagesResponse {
  data: Page[]
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}