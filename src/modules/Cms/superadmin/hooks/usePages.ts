'use client'

import { useState, useEffect, useCallback } from 'react'

import { useTenant } from '@/shared/lib/tenant-context'

import { pageService } from '../services/pageService'

import type { Page, PageQueryParams } from '../../types'

export interface UsePagesReturn {
  pages: Page[]
  loading: boolean
  error: Error | null
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  params: PageQueryParams
  updateParams: (newParams: Partial<PageQueryParams>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  refresh: () => void
  deletePage: (pageId: number) => Promise<void>
  publishPage: (pageId: number) => Promise<void>
  unpublishPage: (pageId: number) => Promise<void>
  duplicatePage: (pageId: number) => Promise<void>
}

export const usePages = (): UsePagesReturn => {
  const { tenantId } = useTenant()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [params, setParams] = useState<PageQueryParams>({
    page: 1,
    per_page: 15
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1
  })

  const fetchPages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await pageService.getPages(tenantId, params)

      setPages(response.data)
      setPagination(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pages'))
      console.error('Error fetching pages:', err)
    } finally {
      setLoading(false)
    }
  }, [tenantId, params])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  const updateParams = useCallback((newParams: Partial<PageQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const setPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, per_page: pageSize, page: 1 }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page: 1 }))
  }, [])

  const deletePage = useCallback(
    async (pageId: number) => {
      try {
        setLoading(true)
        setError(null)
        await pageService.deletePage(pageId, tenantId)
        await fetchPages()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete page'))
        console.error('Error deleting page:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchPages]
  )

  const publishPage = useCallback(
    async (pageId: number) => {
      try {
        setLoading(true)
        setError(null)
        await pageService.publishPage(pageId, tenantId)
        await fetchPages()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to publish page'))
        console.error('Error publishing page:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchPages]
  )

  const unpublishPage = useCallback(
    async (pageId: number) => {
      try {
        setLoading(true)
        setError(null)
        await pageService.unpublishPage(pageId, tenantId)
        await fetchPages()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to unpublish page'))
        console.error('Error unpublishing page:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchPages]
  )

  const duplicatePage = useCallback(
    async (pageId: number) => {
      try {
        setLoading(true)
        setError(null)
        await pageService.duplicatePage(pageId, tenantId)
        await fetchPages()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to duplicate page'))
        console.error('Error duplicating page:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchPages]
  )

  return {
    pages,
    loading,
    error,
    pagination,
    params,
    updateParams,
    setPage,
    setPageSize,
    setSearch,
    refresh: fetchPages,
    deletePage,
    publishPage,
    unpublishPage,
    duplicatePage
  }
}
