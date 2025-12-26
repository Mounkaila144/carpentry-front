// Setting types for CMS module

// Setting value type enum
export type SettingType = 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array'

// Setting entity
export interface Setting {
  id: number
  key: string
  value: string
  casted_value?: string | number | boolean | Record<string, unknown> | unknown[]
  group: string
  type: SettingType
  options?: Record<string, unknown> | null
  is_public: boolean
  created_at?: string
  updated_at?: string
}

// Setting grouped by group name
export interface SettingsGrouped {
  [group: string]: Setting[]
}

// Public settings response (key-value pairs)
export interface PublicSettings {
  [key: string]: string | number | boolean | Record<string, unknown> | unknown[]
}

// Create setting request
export interface CreateSettingRequest {
  key: string
  value: string | number | boolean | Record<string, unknown> | unknown[]
  group?: string
  type?: SettingType
  options?: Record<string, unknown>
  is_public?: boolean
}

// Update setting request
export interface UpdateSettingRequest {
  value?: string | number | boolean | Record<string, unknown> | unknown[]
  group?: string
  type?: SettingType
  options?: Record<string, unknown>
  is_public?: boolean
}

// Setting query parameters
export interface SettingQueryParams {
  group?: string
}

// Bulk update setting item
export interface BulkUpdateSettingItem {
  key: string
  value: string | number | boolean | Record<string, unknown> | unknown[]
  group?: string
}

// Bulk update settings request
export interface BulkUpdateSettingsRequest {
  settings: BulkUpdateSettingItem[]
}

// Get multiple settings request
export interface GetMultipleSettingsRequest {
  keys: string[]
}

// Setting group info
export interface SettingGroupInfo {
  name: string
  label?: string
  description?: string
}
