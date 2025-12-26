// Menu item types for CMS module

import type { SoftDeleteTimestamps } from './common'

// Link target enum
export type LinkTarget = '_self' | '_blank' | '_parent' | '_top'

// Menu item entity
export interface MenuItem extends SoftDeleteTimestamps {
  id: number
  menu_id: number
  parent_id: number | null
  title: string
  url: string | null
  route: string | null
  route_params: Record<string, unknown> | null
  page_id: number | null
  target: LinkTarget
  icon: string | null
  css_class: string | null
  order: number
  is_active: boolean
  children?: MenuItem[]
}

// Create menu item request
export interface CreateMenuItemRequest {
  menu_id: number
  parent_id?: number | null
  title: string
  url?: string | null
  route?: string | null
  route_params?: Record<string, unknown> | null
  page_id?: number | null
  target?: LinkTarget
  icon?: string | null
  css_class?: string | null
  order?: number
  is_active?: boolean
}

// Update menu item request
export interface UpdateMenuItemRequest extends Partial<Omit<CreateMenuItemRequest, 'menu_id'>> {}

// Menu item query parameters
export interface MenuItemQueryParams {
  per_page?: number
  menu_id?: number
}

// Reorder menu item
export interface ReorderMenuItemItem {
  id: number
  order: number
  parent_id?: number | null
}

// Reorder menu items request
export interface ReorderMenuItemsRequest {
  items: ReorderMenuItemItem[]
}
