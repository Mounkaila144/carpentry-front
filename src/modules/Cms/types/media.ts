// Media types for CMS module

import type { BaseQueryParams, SoftDeleteTimestamps } from './common'

// Media type (based on MIME type category)
export type MediaType = 'image' | 'video' | 'application' | 'audio' | 'text' | 'other'

// Media entity
export interface Media extends SoftDeleteTimestamps {
  id: number
  name: string
  filename: string
  path: string
  url: string
  disk: string
  mime_type: string
  size: number
  folder: string | null
  alt: string | null
  title: string | null
  caption: string | null
  metadata?: MediaMetadata | null
}

// Media metadata (for images, videos, etc.)
export interface MediaMetadata {
  width?: number
  height?: number
  duration?: number
  format?: string
  [key: string]: unknown
}

// Create media request (multipart form data)
export interface CreateMediaRequest {
  file: File
  folder?: string
  alt?: string
  title?: string
  caption?: string
}

// Update media request
export interface UpdateMediaRequest {
  name?: string
  alt?: string
  title?: string
  caption?: string
  folder?: string
}

// Media query parameters
export interface MediaQueryParams extends BaseQueryParams {
  type?: MediaType
  folder?: string
}

// Bulk delete media request
export interface BulkDeleteMediaRequest {
  ids: number[]
}

// Media folder info
export interface MediaFolder {
  name: string
  path: string
  count?: number
}

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void
