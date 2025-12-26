'use client'

import { useState, useEffect, useCallback } from 'react'

import { useTenant } from '@/shared/lib/tenant-context'

import { mediaService } from '../services/mediaService'

import type { Media, MediaQueryParams } from '../../types'

export interface UseMediaReturn {
  media: Media[]
  loading: boolean
  error: Error | null
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  params: MediaQueryParams
  updateParams: (newParams: Partial<MediaQueryParams>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  refresh: () => void
  deleteMedia: (mediaId: number) => Promise<void>
  uploadMedia: (file: File, folder?: string, alt?: string) => Promise<void>
}

export const useMedia = (): UseMediaReturn => {
  const { tenantId } = useTenant()
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [params, setParams] = useState<MediaQueryParams>({
    page: 1,
    per_page: 24
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 24,
    last_page: 1
  })

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await mediaService.getMedia(tenantId, params)

      setMedia(response.data)
      setPagination(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch media'))
      console.error('Error fetching media:', err)
    } finally {
      setLoading(false)
    }
  }, [tenantId, params])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const updateParams = useCallback((newParams: Partial<MediaQueryParams>) => {
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

  const deleteMedia = useCallback(
    async (mediaId: number) => {
      try {
        setLoading(true)
        setError(null)
        await mediaService.deleteMedia(mediaId, tenantId)
        await fetchMedia()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete media'))
        console.error('Error deleting media:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchMedia]
  )

  const uploadMedia = useCallback(
    async (file: File, folder?: string, alt?: string) => {
      try {
        setLoading(true)
        setError(null)
        await mediaService.uploadMedia(file, folder, alt, tenantId)
        await fetchMedia()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to upload media'))
        console.error('Error uploading media:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [tenantId, fetchMedia]
  )

  return {
    media,
    loading,
    error,
    pagination,
    params,
    updateParams,
    setPage,
    setPageSize,
    setSearch,
    refresh: fetchMedia,
    deleteMedia,
    uploadMedia
  }
}
