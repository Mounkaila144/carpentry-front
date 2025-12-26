/**
 * CMS Menu Types
 * Based on API documentation
 */

export type MenuLocation = 'header' | 'footer' | 'sidebar' | 'mobile'
export type MenuItemTarget = '_self' | '_blank' | '_parent' | '_top'

export interface Menu {
  id: number
  name: string
  identifier: string
  description?: string
  location: MenuLocation
  is_active: boolean
  items?: MenuItem[]
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface MenuItem {
  id: number
  menu_id: number
  parent_id?: number | null
  title: string
  url?: string
  route?: string
  route_params?: Record<string, any> | null
  page_id?: number | null
  page?: {
    id: number
    slug: string
    title: string
  } | null
  target: MenuItemTarget
  icon?: string
  css_class?: string
  order: number
  is_active: boolean
  children?: MenuItem[]
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CreateMenuPayload {
  name: string
  identifier: string
  description?: string
  location: MenuLocation
  is_active?: boolean
}

export interface UpdateMenuPayload extends Partial<CreateMenuPayload> {}

export interface CreateMenuItemPayload {
  menu_id: number
  parent_id?: number | null
  title: string
  url?: string
  route?: string
  route_params?: Record<string, any> | null
  page_id?: number | null
  target?: MenuItemTarget
  icon?: string
  css_class?: string
  order?: number
  is_active?: boolean
}

export interface UpdateMenuItemPayload extends Partial<CreateMenuItemPayload> {}

export interface MenuQueryParams {
  page?: number
  per_page?: number
}

export interface MenuItemQueryParams {
  page?: number
  per_page?: number
  menu_id?: number
}

export interface MenusResponse {
  data: Menu[]
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface MenuItemsResponse {
  data: MenuItem[]
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}
