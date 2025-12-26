import { createApiClient } from '@/shared/lib/api-client'

import type {
  Page,
  PageQueryParams,
  PagesResponse,
  CreatePagePayload,
  UpdatePagePayload
} from '../../types'

/**
 * Page Service
 * Handles all API communication related to CMS pages
 */
class PageService {
  /**
   * Fetch paginated pages with filters
   * @param tenantId - The tenant ID for multi-tenancy
   * @param params - Query parameters including pagination and filters
   * @returns Promise with paginated response
   */
  async getPages(tenantId?: string, params?: PageQueryParams): Promise<PagesResponse> {
    try {
      const client = createApiClient(tenantId)

      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.per_page) queryParams.append('per_page', String(params.per_page))
      if (params?.search) queryParams.append('search', params.search)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.is_active !== undefined) queryParams.append('is_active', String(params.is_active))
      if (params?.parent_id !== undefined) queryParams.append('parent_id', String(params.parent_id || ''))

      const queryString = queryParams.toString()
      const url = `/superadmin/cms/pages${queryString ? `?${queryString}` : ''}`

      const response = await client.get<PagesResponse>(url)

      return response.data
    } catch (error) {
      console.error('Error fetching pages:', error)
      throw error
    }
  }

  /**
   * Fetch a single page by ID
   * @param pageId - The page ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with page data
   */
  async getPageById(pageId: number, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.get<{ data: Page }>(`/superadmin/cms/pages/${pageId}`)

      return response.data.data
    } catch (error) {
      console.error(`Error fetching page ${pageId}:`, error)
      throw error
    }
  }

  /**
   * Create a new page
   * @param pageData - The page data to create
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with created page data
   */
  async createPage(pageData: CreatePagePayload, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Page }>('/superadmin/cms/pages', pageData)

      return response.data.data
    } catch (error) {
      console.error('Error creating page:', error)
      throw error
    }
  }

  /**
   * Update an existing page
   * @param pageId - The page ID
   * @param pageData - The page data to update
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with updated page data
   */
  async updatePage(pageId: number, pageData: UpdatePagePayload, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.put<{ data: Page }>(`/superadmin/cms/pages/${pageId}`, pageData)

      return response.data.data
    } catch (error) {
      console.error(`Error updating page ${pageId}:`, error)
      throw error
    }
  }

  /**
   * Delete a page (soft delete)
   * @param pageId - The page ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with success status
   */
  async deletePage(pageId: number, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.delete<{ message: string }>(`/superadmin/cms/pages/${pageId}`)
    } catch (error) {
      console.error(`Error deleting page ${pageId}:`, error)
      throw error
    }
  }

  /**
   * Publish a page
   * @param pageId - The page ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with updated page data
   */
  async publishPage(pageId: number, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Page }>(`/superadmin/cms/pages/${pageId}/publish`)

      return response.data.data
    } catch (error) {
      console.error(`Error publishing page ${pageId}:`, error)
      throw error
    }
  }

  /**
   * Unpublish a page
   * @param pageId - The page ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with updated page data
   */
  async unpublishPage(pageId: number, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Page }>(`/superadmin/cms/pages/${pageId}/unpublish`)

      return response.data.data
    } catch (error) {
      console.error(`Error unpublishing page ${pageId}:`, error)
      throw error
    }
  }

  /**
   * Duplicate a page
   * @param pageId - The page ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with duplicated page data
   */
  async duplicatePage(pageId: number, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Page }>(`/superadmin/cms/pages/${pageId}/duplicate`)

      return response.data.data
    } catch (error) {
      console.error(`Error duplicating page ${pageId}:`, error)
      throw error
    }
  }

  /**
   * Restore a deleted page
   * @param pageId - The page ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with restored page data
   */
  async restorePage(pageId: number, tenantId?: string): Promise<Page> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Page }>(`/superadmin/cms/pages/${pageId}/restore`)

      return response.data.data
    } catch (error) {
      console.error(`Error restoring page ${pageId}:`, error)
      throw error
    }
  }
}

// Export a singleton instance
export const pageService = new PageService()
