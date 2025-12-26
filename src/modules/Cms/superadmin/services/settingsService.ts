import { createApiClient } from '@/shared/lib/api-client'

import type { Setting, SettingsGroupedResponse, CreateSettingPayload, UpdateSettingPayload, BulkUpdateSettingsPayload } from '../../types'

/**
 * Settings Service
 * Handles all API communication related to CMS settings
 */
class SettingsService {
  /**
   * Fetch all settings (grouped by group)
   */
  async getSettings(tenantId?: string, group?: string): Promise<SettingsGroupedResponse> {
    try {
      const client = createApiClient(tenantId)

      const queryParams = new URLSearchParams()

      if (group) queryParams.append('group', group)

      const queryString = queryParams.toString()
      const url = `/superadmin/cms/settings${queryString ? `?${queryString}` : ''}`

      const response = await client.get<SettingsGroupedResponse>(url)

      return response.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }

  /**
   * Get a single setting by ID
   */
  async getSettingById(settingId: number, tenantId?: string): Promise<Setting> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.get<{ data: Setting }>(`/superadmin/cms/settings/${settingId}`)

      return response.data.data
    } catch (error) {
      console.error(`Error fetching setting ${settingId}:`, error)
      throw error
    }
  }

  /**
   * Create a new setting
   */
  async createSetting(settingData: CreateSettingPayload, tenantId?: string): Promise<Setting> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Setting }>('/superadmin/cms/settings', settingData)

      return response.data.data
    } catch (error) {
      console.error('Error creating setting:', error)
      throw error
    }
  }

  /**
   * Update an existing setting
   */
  async updateSetting(settingId: number, settingData: UpdateSettingPayload, tenantId?: string): Promise<Setting> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.put<{ data: Setting }>(`/superadmin/cms/settings/${settingId}`, settingData)

      return response.data.data
    } catch (error) {
      console.error(`Error updating setting ${settingId}:`, error)
      throw error
    }
  }

  /**
   * Delete a setting
   */
  async deleteSetting(settingId: number, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.delete<{ message: string }>(`/superadmin/cms/settings/${settingId}`)
    } catch (error) {
      console.error(`Error deleting setting ${settingId}:`, error)
      throw error
    }
  }

  /**
   * Bulk update settings
   */
  async bulkUpdateSettings(payload: BulkUpdateSettingsPayload, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.post<{ message: string }>('/superadmin/cms/settings/bulk', payload)
    } catch (error) {
      console.error('Error bulk updating settings:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const settingsService = new SettingsService()
