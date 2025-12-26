'use client'

import { useState, useEffect, useCallback } from 'react'

import { useTenant } from '@/shared/lib/tenant-context'

import { blockService } from '../services/blockService'

import type { Block, BlockQueryParams } from '../../types'

export interface UseBlocksReturn {
  blocks: Block[]
  loading: boolean
  error: Error | null
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  params: BlockQueryParams
  updateParams: (newParams: Partial<BlockQueryParams>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  refresh: () => void
  deleteBlock: (blockId: number) => Promise<void>
}

export const useBlocks = (): UseBlocksReturn => {
  const { tenantId } = useTenant()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [params, setParams] = useState<BlockQueryParams>({
    page: 1,
    per_page: 15
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1
  })

  const fetchBlocks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await blockService.getBlocks(tenantId, params)

      setBlocks(response.data)
      setPagination(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'))
      console.error('Error fetching blocks:', err)
    } finally {
      setLoading(false)
    }
  }, [tenantId, params])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const updateParams = useCallback((newParams: Partial<BlockQueryParams>) => {
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

  const deleteBlock = useCallback(
    async (blockId: number) => {
      try {
        setLoading(true)
        setError(null)
        await blockService.deleteBlock(blockId, tenantId)
        await fetchBlocks()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete block'))
        console.error('Error deleting block:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchBlocks]
  )

  return {
    blocks,
    loading,
    error,
    pagination,
    params,
    updateParams,
    setPage,
    setPageSize,
    setSearch,
    refresh: fetchBlocks,
    deleteBlock
  }
}
