'use client'

import { useState, useEffect, useCallback } from 'react'

import { useTenant } from '@/shared/lib/tenant-context'

import { menuService } from '../services/menuService'

import type { MenuItem, MenuItemQueryParams } from '../../types'

export interface UseMenuItemsReturn {
  menuItems: MenuItem[]
  loading: boolean
  error: Error | null
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  params: MenuItemQueryParams
  updateParams: (newParams: Partial<MenuItemQueryParams>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  refresh: () => void
  deleteMenuItem: (itemId: number) => Promise<void>
  createMenuItem: (itemData: import('../../types').CreateMenuItemPayload) => Promise<void>
  updateMenuItem: (itemId: number, itemData: import('../../types').UpdateMenuItemPayload) => Promise<void>
}

export const useMenuItems = (): UseMenuItemsReturn => {
  const { tenantId } = useTenant()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [params, setParams] = useState<MenuItemQueryParams>({
    page: 1,
    per_page: 50
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 50,
    last_page: 1
  })

  const fetchMenuItems = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await menuService.getMenuItems(tenantId, params)

      setMenuItems(response.data)
      setPagination(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch menu items'))
      console.error('Error fetching menu items:', err)
    } finally {
      setLoading(false)
    }
  }, [tenantId, params])

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const updateParams = useCallback((newParams: Partial<MenuItemQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const setPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, per_page: pageSize, page: 1 }))
  }, [])

  const deleteMenuItem = useCallback(
    async (itemId: number) => {
      try {
        setLoading(true)
        setError(null)
        await menuService.deleteMenuItem(itemId, tenantId)
        await fetchMenuItems()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete menu item'))
        console.error('Error deleting menu item:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchMenuItems]
  )

  const createMenuItem = useCallback(
    async (itemData: import('../../types').CreateMenuItemPayload) => {
      try {
        setLoading(true)
        setError(null)
        await menuService.createMenuItem(itemData, tenantId)
        await fetchMenuItems()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create menu item'))
        console.error('Error creating menu item:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchMenuItems]
  )

  const updateMenuItem = useCallback(
    async (itemId: number, itemData: import('../../types').UpdateMenuItemPayload) => {
      try {
        setLoading(true)
        setError(null)
        await menuService.updateMenuItem(itemId, itemData, tenantId)
        await fetchMenuItems()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update menu item'))
        console.error('Error updating menu item:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchMenuItems]
  )

  return {
    menuItems,
    loading,
    error,
    pagination,
    params,
    updateParams,
    setPage,
    setPageSize,
    refresh: fetchMenuItems,
    deleteMenuItem,
    createMenuItem,
    updateMenuItem
  }
}
