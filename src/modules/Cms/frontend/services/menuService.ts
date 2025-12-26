/**
 * Frontend CMS Menu Service
 * Public API endpoints - no authentication required
 * Uses CMS-specific API URL (superadmin domain)
 */

import type { Menu, MenuLocation } from '@/modules/Cms/types/menu.types'

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://api.local/api'

class MenuService {
  /**
   * Get menu by identifier
   */
  async getMenuByIdentifier(identifier: string, tenantId?: string): Promise<Menu> {
    const response = await fetch(`${CMS_API_URL}/cms/menus/${identifier}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${identifier}`)
    }

    const result = await response.json()

    return result.data
  }

  /**
   * Get menu by location
   */
  async getMenuByLocation(location: MenuLocation, tenantId?: string): Promise<Menu> {
    const response = await fetch(`${CMS_API_URL}/cms/menus/location/${location}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch menu for location: ${location}`)
    }

    const result = await response.json()

    return result.data
  }
}

// Export singleton instance
export const menuService = new MenuService()

// Also export standalone functions for backward compatibility
export async function getMenuByIdentifier(identifier: string): Promise<Menu> {
  return menuService.getMenuByIdentifier(identifier)
}

export async function getMenuByLocation(location: MenuLocation): Promise<Menu> {
  return menuService.getMenuByLocation(location)
}
