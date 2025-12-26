import { createApiClient } from '@/shared/lib/api-client'

import type { Media, MediaQueryParams, MediaResponse, UpdateMediaPayload } from '../../types'

/**
 * Media Service
 * Handles all API communication related to CMS media
 */
class MediaService {
  /**
   * Fetch paginated media files
   */
  async getMedia(tenantId?: string, params?: MediaQueryParams): Promise<MediaResponse> {
    try {
      const client = createApiClient(tenantId)

      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.per_page) queryParams.append('per_page', String(params.per_page))
      if (params?.search) queryParams.append('search', params.search)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.folder) queryParams.append('folder', params.folder)

      const queryString = queryParams.toString()
      const url = `/superadmin/cms/media${queryString ? `?${queryString}` : ''}`

      const response = await client.get<MediaResponse>(url)

      return response.data
    } catch (error) {
      console.error('Error fetching media:', error)
      throw error
    }
  }

  /**
   * Upload a new media file
   */
  async uploadMedia(file: File, folder?: string, alt?: string, tenantId?: string): Promise<Media> {
    try {
      const client = createApiClient(tenantId)

      const formData = new FormData()

      formData.append('file', file)
      if (folder) formData.append('folder', folder)
      if (alt) formData.append('alt', alt)

      const response = await client.post<{ data: Media }>('/superadmin/cms/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data.data
    } catch (error) {
      console.error('Error uploading media:', error)
      throw error
    }
  }

  /**
   * Update media metadata
   */
  async updateMedia(mediaId: number, mediaData: UpdateMediaPayload, tenantId?: string): Promise<Media> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.put<{ data: Media }>(`/superadmin/cms/media/${mediaId}`, mediaData)

      return response.data.data
    } catch (error) {
      console.error(`Error updating media ${mediaId}:`, error)
      throw error
    }
  }

  /**
   * Delete a media file
   */
  async deleteMedia(mediaId: number, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.delete<{ message: string }>(`/superadmin/cms/media/${mediaId}`)
    } catch (error) {
      console.error(`Error deleting media ${mediaId}:`, error)
      throw error
    }
  }

  /**
   * Bulk delete media files
   */
  async bulkDeleteMedia(mediaIds: number[], tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.post<{ message: string }>('/superadmin/cms/media/bulk-delete', { ids: mediaIds })
    } catch (error) {
      console.error('Error bulk deleting media:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const mediaService = new MediaService()
