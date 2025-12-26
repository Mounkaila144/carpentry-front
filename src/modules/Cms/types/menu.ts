// Menu types for CMS module

import type { SoftDeleteTimestamps } from './common'

import type { MenuItem } from './menuItem'

// Menu location enum
export type MenuLocation = 'header' | 'footer' | 'sidebar' | 'mobile'

// Menu entity
export interface Menu extends SoftDeleteTimestamps {
  id: number
  name: string
  identifier: string
  description?: string | null
  location: MenuLocation
  is_active: boolean
  items?: MenuItem[]
}

// Create menu request
export interface CreateMenuRequest {
  name: string
  identifier: string
  description?: string
  location: MenuLocation
  is_active?: boolean
}

// Update menu request
export interface UpdateMenuRequest extends Partial<CreateMenuRequest> {}

// Menu query parameters
export interface MenuQueryParams {
  per_page?: number
  search?: string
  location?: MenuLocation
}

// Menu location info
export interface MenuLocationInfo {
  key: MenuLocation
  label: string
  description?: string
}
