'use client'

/**
 * Frontend CMS Menus Hooks
 */

import { useState, useEffect } from 'react'

import type { Menu, MenuLocation } from '@/modules/Cms/types/menu.types'

import { getMenuByIdentifier, getMenuByLocation } from '../services/menuService'

/**
 * Hook to fetch a menu by identifier
 */
export function useMenu(identifier: string) {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const data = await getMenuByIdentifier(identifier)

        setMenu(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch menu'))
      } finally {
        setLoading(false)
      }
    }

    if (identifier) {
      fetchMenu()
    }
  }, [identifier])

  return { menu, loading, error }
}

/**
 * Hook to fetch a menu by location
 */
export function useMenuByLocation(location: MenuLocation) {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const data = await getMenuByLocation(location)

        setMenu(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch menu'))
      } finally {
        setLoading(false)
      }
    }

    if (location) {
      fetchMenu()
    }
  }, [location])

  return { menu, loading, error }
}
