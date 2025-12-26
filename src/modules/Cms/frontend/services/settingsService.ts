/**
 * Frontend CMS Settings Service
 * Public API endpoints - no authentication required
 * Only returns public settings (is_public: true)
 * Uses CMS-specific API URL (superadmin domain)
 */

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://api.local/api'

/**
 * Get all public settings
 */
export async function getPublicSettings(): Promise<Record<string, any>> {
  const response = await fetch(`${CMS_API_URL}/cms/settings`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch public settings')
  }

  const result = await response.json()

  return result.data
}

/**
 * Get a single public setting by key
 */
export async function getSettingByKey(key: string): Promise<any> {
  const response = await fetch(`${CMS_API_URL}/cms/settings/${key}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch setting: ${key}`)
  }

  const result = await response.json()

  return result.data
}

/**
 * Get multiple public settings by keys
 */
export async function getMultipleSettings(keys: string[]): Promise<Record<string, any>> {
  const queryParams = new URLSearchParams()

  keys.forEach(key => queryParams.append('keys[]', key))

  const response = await fetch(`${CMS_API_URL}/cms/settings/multiple?${queryParams.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch multiple settings')
  }

  const result = await response.json()

  return result.data
}
