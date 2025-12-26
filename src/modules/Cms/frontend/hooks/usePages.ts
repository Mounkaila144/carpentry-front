'use client'

/**
 * Frontend CMS Pages Hooks
 */

import { useState, useEffect } from 'react'

import type { Page, PageQueryParams, PagesResponse } from '@/modules/Cms/types/page.types'

import { getPages, getPageBySlug, getHomePage, getPagesTree } from '../services/pageService'

/**
 * Hook to fetch all published pages
 */
export function usePages(params?: PageQueryParams) {
  const [pages, setPages] = useState<PagesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true)
        const data = await getPages(params)

        setPages(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch pages'))
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [params?.per_page, params?.parent_id])

  return { pages, loading, error }
}

/**
 * Hook to fetch a single page by slug
 */
export function usePage(slug: string) {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        const data = await getPageBySlug(slug)

        setPage(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch page'))
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug])

  return { page, loading, error }
}

/**
 * Hook to fetch the home page
 */
export function useHomePage() {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        setLoading(true)
        const data = await getHomePage()

        setPage(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch home page'))
      } finally {
        setLoading(false)
      }
    }

    fetchHomePage()
  }, [])

  return { page, loading, error }
}

/**
 * Hook to fetch pages tree structure
 */
export function usePagesTree() {
  const [tree, setTree] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true)
        const data = await getPagesTree()

        setTree(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch pages tree'))
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [])

  return { tree, loading, error }
}
