/**
 * CMS Block Types
 * Based on API documentation
 */

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

export interface Block {
  id: number
  name: string
  identifier: string
  type: BlockType
  content: Record<string, any>
  settings?: Record<string, any>
  page_id?: number | null
  order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CreateBlockPayload {
  name: string
  identifier: string
  type: BlockType
  content: Record<string, any>
  settings?: Record<string, any>
  page_id?: number | null
  order?: number
  is_active?: boolean
}

export interface UpdateBlockPayload extends Partial<CreateBlockPayload> {}

export interface BlockQueryParams {
  page?: number
  per_page?: number
  search?: string
  type?: BlockType
  page_id?: number
}

export interface BlocksResponse {
  data: Block[]
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}
