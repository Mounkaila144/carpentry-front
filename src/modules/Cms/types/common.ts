// Common types for CMS module

// Pagination meta from API responses
export interface PaginationMeta {
  current_page: number
  total: number
  per_page?: number
  last_page?: number
  from?: number
  to?: number
}

// Generic paginated API response
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Generic API response for single item
export interface ApiResponse<T> {
  data: T
  message?: string
}

// Generic API response for lists
export interface ApiListResponse<T> {
  data: T[]
}

// Soft delete timestamps
export interface SoftDeleteTimestamps {
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

// Common query parameters for listing
export interface BaseQueryParams {
  per_page?: number
  page?: number
  search?: string
}
