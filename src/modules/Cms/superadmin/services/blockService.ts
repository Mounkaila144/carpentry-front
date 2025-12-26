import { createApiClient } from '@/shared/lib/api-client'

import type {
  Block,
  BlockQueryParams,
  BlocksResponse,
  CreateBlockPayload,
  UpdateBlockPayload
} from '../../types'

/**
 * Block Service
 * Handles all API communication related to CMS blocks
 */
class BlockService {
  /**
   * Fetch paginated blocks with filters
   * @param tenantId - The tenant ID for multi-tenancy
   * @param params - Query parameters including pagination and filters
   * @returns Promise with paginated response
   */
  async getBlocks(tenantId?: string, params?: BlockQueryParams): Promise<BlocksResponse> {
    try {
      const client = createApiClient(tenantId)

      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.per_page) queryParams.append('per_page', String(params.per_page))
      if (params?.search) queryParams.append('search', params.search)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.page_id !== undefined) queryParams.append('page_id', String(params.page_id))

      const queryString = queryParams.toString()
      const url = `/superadmin/cms/blocks${queryString ? `?${queryString}` : ''}`

      const response = await client.get<BlocksResponse>(url)

      return response.data
    } catch (error) {
      console.error('Error fetching blocks:', error)
      throw error
    }
  }

  /**
   * Fetch a single block by ID
   * @param blockId - The block ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with block data
   */
  async getBlockById(blockId: number, tenantId?: string): Promise<Block> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.get<{ data: Block }>(`/superadmin/cms/blocks/${blockId}`)

      return response.data.data
    } catch (error) {
      console.error(`Error fetching block ${blockId}:`, error)
      throw error
    }
  }

  /**
   * Create a new block
   * @param blockData - The block data to create
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with created block data
   */
  async createBlock(blockData: CreateBlockPayload, tenantId?: string): Promise<Block> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Block }>('/superadmin/cms/blocks', blockData)

      return response.data.data
    } catch (error) {
      console.error('Error creating block:', error)
      throw error
    }
  }

  /**
   * Update an existing block
   * @param blockId - The block ID
   * @param blockData - The block data to update
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with updated block data
   */
  async updateBlock(blockId: number, blockData: UpdateBlockPayload, tenantId?: string): Promise<Block> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.put<{ data: Block }>(`/superadmin/cms/blocks/${blockId}`, blockData)

      return response.data.data
    } catch (error) {
      console.error(`Error updating block ${blockId}:`, error)
      throw error
    }
  }

  /**
   * Delete a block (soft delete)
   * @param blockId - The block ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with success status
   */
  async deleteBlock(blockId: number, tenantId?: string): Promise<void> {
    try {
      const client = createApiClient(tenantId)
      await client.delete<{ message: string }>(`/superadmin/cms/blocks/${blockId}`)
    } catch (error) {
      console.error(`Error deleting block ${blockId}:`, error)
      throw error
    }
  }

  /**
   * Restore a deleted block
   * @param blockId - The block ID
   * @param tenantId - The tenant ID for multi-tenancy
   * @returns Promise with restored block data
   */
  async restoreBlock(blockId: number, tenantId?: string): Promise<Block> {
    try {
      const client = createApiClient(tenantId)
      const response = await client.post<{ data: Block }>(`/superadmin/cms/blocks/${blockId}/restore`)

      return response.data.data
    } catch (error) {
      console.error(`Error restoring block ${blockId}:`, error)
      throw error
    }
  }
}

// Export a singleton instance
export const blockService = new BlockService()
