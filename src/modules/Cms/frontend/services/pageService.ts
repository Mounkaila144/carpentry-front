/**
 * Frontend CMS Page Service
 * Public API endpoints - no authentication required
 * Uses CMS-specific API URL (superadmin domain)
 */

import type { Page, PageQueryParams, PagesResponse } from '@/modules/Cms/types/page.types'

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://api.local/api'

/**
 * Get all published pages
 */
export async function getPages(params?: PageQueryParams): Promise<PagesResponse> {
  const queryParams = new URLSearchParams()

  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
  if (params?.parent_id !== undefined) queryParams.append('parent_id', String(params.parent_id))

  const url = `${CMS_API_URL}/cms/pages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pages')
  }

  return response.json()
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page> {
  const response = await fetch(`${CMS_API_URL}/cms/pages/${slug}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${slug}`)
  }

  const result = await response.json()

  return result.data
}

/**
 * Get home page
 */
export async function getHomePage(): Promise<Page> {
  const response = await fetch(`${CMS_API_URL}/cms/pages/home`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch home page')
  }

  const result = await response.json()

  return result.data
}

/**
 * Get pages tree structure
 */
export async function getPagesTree(): Promise<Page[]> {
  const response = await fetch(`${CMS_API_URL}/cms/pages/tree`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pages tree')
  }

  const result = await response.json()

  return result.data
}