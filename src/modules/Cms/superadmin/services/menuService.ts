import { createApiClient } from '@/shared/lib/api-client'

import type {
  Menu,
  MenuItem,
  MenuQueryParams,
  MenuItemQueryParams,
  MenusResponse,
  MenuItemsResponse,
  CreateMenuPayload,
  UpdateMenuPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload
} from '../../types'

/**
 * Menu Service
 * Handles all API communication related to CMS menus
 */
class MenuService {
  /**
   * Fetch paginated menus
   */
  async getMenus(tenantId?: string, params?: MenuQueryParams): Promise<MenusResponse> {
    try {
      const client = createApiClient(tenantId)

      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.per_page) queryParams.append('per_page', String(params.per_page))

      const queryString = queryParams.toString()
      const url = `/superadmin/cms/menus${queryString ? `?${queryString}` : ''}`

      const response = await client.get<MenusResponse>(url)

      return response.data
    } catch (error) {
      console.error('Error fetching menus:', error)
      throw error
    }
  }

  /**
   * Fetch a single menu by ID
   */
  async getMenuById(menuId: number, tenantId?: string): Promise<Menu> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.get<{ data: Menu }>(`/superadmin/cms/menus/${menuId}`)

      return response.data.data
    } catch (error) {
      console.error(`Error fetching menu ${menuId}:`, error)
      throw error
    }
  }

  /**
   * Create a new menu
   */
  async createMenu(menuData: CreateMenuPayload, tenantId?: string): Promise<Menu> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Menu }>('/superadmin/cms/menus', menuData)

      return response.data.data
    } catch (error) {
      console.error('Error creating menu:', error)
      throw error
    }
  }

  /**
   * Update an existing menu
   */
  async updateMenu(menuId: number, menuData: UpdateMenuPayload, tenantId?: string): Promise<Menu> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.put<{ data: Menu }>(`/superadmin/cms/menus/${menuId}`, menuData)

      return response.data.data
    } catch (error) {
      console.error(`Error updating menu ${menuId}:`, error)
      throw error
    }
  }

  /**
   * Delete a menu (soft delete)
   */
  async deleteMenu(menuId: number, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.delete<{ message: string }>(`/superadmin/cms/menus/${menuId}`)
    } catch (error) {
      console.error(`Error deleting menu ${menuId}:`, error)
      throw error
    }
  }

  /**
   * Restore a deleted menu
   */
  async restoreMenu(menuId: number, tenantId?: string): Promise<Menu> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Menu }>(`/superadmin/cms/menus/${menuId}/restore`)

      return response.data.data
    } catch (error) {
      console.error(`Error restoring menu ${menuId}:`, error)
      throw error
    }
  }

  // ===== MENU ITEMS =====

  /**
   * Fetch paginated menu items
   */
  async getMenuItems(tenantId?: string, params?: MenuItemQueryParams): Promise<MenuItemsResponse> {
    try {
      const client = createApiClient(tenantId)

      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.per_page) queryParams.append('per_page', String(params.per_page))
      if (params?.menu_id !== undefined) queryParams.append('menu_id', String(params.menu_id))

      const queryString = queryParams.toString()
      const url = `/superadmin/cms/menu-items${queryString ? `?${queryString}` : ''}`

      const response = await client.get<MenuItemsResponse>(url)

      return response.data
    } catch (error) {
      console.error('Error fetching menu items:', error)
      throw error
    }
  }

  /**
   * Fetch a single menu item by ID
   */
  async getMenuItemById(itemId: number, tenantId?: string): Promise<MenuItem> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.get<{ data: MenuItem }>(`/superadmin/cms/menu-items/${itemId}`)

      return response.data.data
    } catch (error) {
      console.error(`Error fetching menu item ${itemId}:`, error)
      throw error
    }
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(itemData: CreateMenuItemPayload, tenantId?: string): Promise<MenuItem> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: MenuItem }>('/superadmin/cms/menu-items', itemData)

      return response.data.data
    } catch (error) {
      console.error('Error creating menu item:', error)
      throw error
    }
  }

  /**
   * Update an existing menu item
   */
  async updateMenuItem(itemId: number, itemData: UpdateMenuItemPayload, tenantId?: string): Promise<MenuItem> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.put<{ data: MenuItem }>(`/superadmin/cms/menu-items/${itemId}`, itemData)

      return response.data.data
    } catch (error) {
      console.error(`Error updating menu item ${itemId}:`, error)
      throw error
    }
  }

  /**
   * Delete a menu item (soft delete)
   */
  async deleteMenuItem(itemId: number, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.delete<{ message: string }>(`/superadmin/cms/menu-items/${itemId}`)
    } catch (error) {
      console.error(`Error deleting menu item ${itemId}:`, error)
      throw error
    }
  }

  /**
   * Restore a deleted menu item
   */
  async restoreMenuItem(itemId: number, tenantId?: string): Promise<MenuItem> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: MenuItem }>(`/superadmin/cms/menu-items/${itemId}/restore`)

      return response.data.data
    } catch (error) {
      console.error(`Error restoring menu item ${itemId}:`, error)
      throw error
    }
  }
}

// Export a singleton instance
export const menuService = new MenuService()
