'use client'

import { useState, useEffect, useCallback } from 'react'

import { useTenant } from '@/shared/lib/tenant-context'

import { menuService } from '../services/menuService'

import type { Menu, MenuQueryParams } from '../../types'

export interface UseMenusReturn {
  menus: Menu[]
  loading: boolean
  error: Error | null
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  params: MenuQueryParams
  updateParams: (newParams: Partial<MenuQueryParams>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  refresh: () => void
  deleteMenu: (menuId: number) => Promise<void>
}

export const useMenus = (): UseMenusReturn => {
  const { tenantId } = useTenant()
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [params, setParams] = useState<MenuQueryParams>({
    page: 1,
    per_page: 15
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1
  })

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await menuService.getMenus(tenantId, params)

      setMenus(response.data)
      setPagination(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch menus'))
      console.error('Error fetching menus:', err)
    } finally {
      setLoading(false)
    }
  }, [tenantId, params])

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  const updateParams = useCallback((newParams: Partial<MenuQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const setPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, per_page: pageSize, page: 1 }))
  }, [])

  const deleteMenu = useCallback(
    async (menuId: number) => {
      try {
        setLoading(true)
        setError(null)
        await menuService.deleteMenu(menuId, tenantId)
        await fetchMenus()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete menu'))
        console.error('Error deleting menu:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchMenus]
  )

  return {
    menus,
    loading,
    error,
    pagination,
    params,
    updateParams,
    setPage,
    setPageSize,
    refresh: fetchMenus,
    deleteMenu
  }
}
