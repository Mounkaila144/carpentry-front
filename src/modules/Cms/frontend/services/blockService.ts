/**
 * Frontend CMS Block Service
 * Public API endpoints - no authentication required
 * Uses CMS-specific API URL (superadmin domain)
 */

import type { Block, BlockQueryParams, BlocksResponse } from '@/modules/Cms/types/block.types'

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://api.local/api'

/**
 * Get all active blocks
 */
export async function getBlocks(params?: BlockQueryParams): Promise<BlocksResponse> {
  const queryParams = new URLSearchParams()

  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
  if (params?.type) queryParams.append('type', params.type)

  const url = `${CMS_API_URL}/cms/blocks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch blocks')
  }

  return response.json()
}

/**
 * Get block by identifier
 */
export async function getBlockByIdentifier(identifier: string): Promise<Block> {
  const response = await fetch(`${CMS_API_URL}/cms/blocks/${identifier}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch block: ${identifier}`)
  }

  const result = await response.json()

  return result.data
}

/**
 * Get multiple blocks by identifiers
 */
export async function getMultipleBlocks(identifiers: string[]): Promise<Record<string, Block>> {
  const queryParams = new URLSearchParams()

  identifiers.forEach(id => queryParams.append('identifiers[]', id))

  const response = await fetch(`${CMS_API_URL}/cms/blocks/multiple?${queryParams.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch multiple blocks')
  }

  const result = await response.json()

  return result.data
}
