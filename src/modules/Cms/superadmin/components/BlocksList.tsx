'use client'

import { createContext, useContext } from 'react'

import Grid from '@mui/material/Grid2'

import BlocksListTable from './BlocksListTable'
import { useBlocks } from '../hooks/useBlocks'

import type { UseBlocksReturn } from '../hooks/useBlocks'

const BlocksContext = createContext<UseBlocksReturn | undefined>(undefined)

export const useBlocksContext = () => {
  const context = useContext(BlocksContext)

  if (!context) {
    throw new Error('useBlocksContext must be used within BlocksList')
  }

  return context
}

/**
 * BlocksList Component
 * Main component for displaying CMS blocks with table
 */
export const BlocksList = () => {
  const blocksData = useBlocks()

  return (
    <BlocksContext.Provider value={blocksData}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <BlocksListTable />
        </Grid>
      </Grid>
    </BlocksContext.Provider>
  )
}
