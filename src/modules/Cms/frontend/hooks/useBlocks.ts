'use client'

/**
 * Frontend CMS Blocks Hooks
 */

import { useState, useEffect } from 'react'

import type { Block, BlockQueryParams, BlocksResponse } from '@/modules/Cms/types/block.types'

import { getBlocks, getBlockByIdentifier, getMultipleBlocks } from '../services/blockService'

/**
 * Hook to fetch all active blocks
 */
export function useBlocks(params?: BlockQueryParams) {
  const [blocks, setBlocks] = useState<BlocksResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true)
        const data = await getBlocks(params)

        setBlocks(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blocks'))
      } finally {
        setLoading(false)
      }
    }

    fetchBlocks()
  }, [params?.per_page, params?.type])

  return { blocks, loading, error }
}

/**
 * Hook to fetch a single block by identifier
 */
export function useBlock(identifier: string) {
  const [block, setBlock] = useState<Block | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        setLoading(true)
        const data = await getBlockByIdentifier(identifier)

        setBlock(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch block'))
      } finally {
        setLoading(false)
      }
    }

    if (identifier) {
      fetchBlock()
    }
  }, [identifier])

  return { block, loading, error }
}

/**
 * Hook to fetch multiple blocks by identifiers
 */
export function useMultipleBlocks(identifiers: string[]) {
  const [blocks, setBlocks] = useState<Record<string, Block>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMultipleBlocks = async () => {
      try {
        setLoading(true)
        const data = await getMultipleBlocks(identifiers)

        setBlocks(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch multiple blocks'))
      } finally {
        setLoading(false)
      }
    }

    if (identifiers.length > 0) {
      fetchMultipleBlocks()
    }
  }, [identifiers.join(',')])

  return { blocks, loading, error }
}
