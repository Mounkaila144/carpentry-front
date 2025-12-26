/**
 * CMS Media Types
 * Based on API documentation
 */

export interface Media {
  id: number
  name: string
  filename: string
  path: string // Relative path
  disk: string
  mime_type: string
  size: number
  human_size: string
  width?: number
  height?: number
  alt?: string | null
  title?: string | null
  caption?: string | null
  folder?: string
  metadata?: any
  is_active: boolean
  url: string // Full URL
  is_image: boolean
  is_video: boolean
  is_document: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateMediaPayload {
  file: File
  folder?: string
  alt?: string
  title?: string
  caption?: string
}

export interface UpdateMediaPayload {
  name?: string
  alt?: string
  title?: string
  caption?: string
  folder?: string
}

export interface MediaQueryParams {
  page?: number
  per_page?: number
  search?: string
  type?: string
  folder?: string
}

export interface MediaResponse {
  data: Media[]
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}
