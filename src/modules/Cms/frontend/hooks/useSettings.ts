'use client'

/**
 * Frontend CMS Settings Hooks
 */

import { useState, useEffect } from 'react'

import { getPublicSettings, getSettingByKey, getMultipleSettings } from '../services/settingsService'

/**
 * Hook to fetch all public settings
 */
export function useSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const data = await getPublicSettings()

        setSettings(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'))
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}

/**
 * Hook to fetch a single setting by key
 */
export function useSetting(key: string) {
  const [setting, setSetting] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setLoading(true)
        const data = await getSettingByKey(key)

        setSetting(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch setting'))
      } finally {
        setLoading(false)
      }
    }

    if (key) {
      fetchSetting()
    }
  }, [key])

  return { setting, loading, error }
}

/**
 * Hook to fetch multiple settings by keys
 */
export function useMultipleSettings(keys: string[]) {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const data = await getMultipleSettings(keys)

        setSettings(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'))
      } finally {
        setLoading(false)
      }
    }

    if (keys.length > 0) {
      fetchSettings()
    }
  }, [keys.join(',')])

  return { settings, loading, error }
}
