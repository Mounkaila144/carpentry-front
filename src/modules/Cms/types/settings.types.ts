/**
 * CMS Settings Types
 * Based on API documentation
 */

export type SettingType = 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array'

export interface Setting {
  id: number
  key: string
  value: string
  group: string
  type: SettingType
  options?: any
  is_public: boolean
  casted_value?: any
  created_at?: string
  updated_at?: string
}

export interface CreateSettingPayload {
  key: string
  value: string
  group: string
  type: SettingType
  options?: any
  is_public?: boolean
}

export interface UpdateSettingPayload {
  value?: string
  is_public?: boolean
}

export interface SettingsGroupedResponse {
  data: {
    [group: string]: Setting[]
  }
}

export interface BulkUpdateSettingsPayload {
  settings: Array<{
    key: string
    value: string
    group?: string
  }>
}
