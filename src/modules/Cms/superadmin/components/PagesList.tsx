'use client'

import { createContext, useContext } from 'react'

import Grid from '@mui/material/Grid2'

import PagesListTable from './PagesListTable'
import { usePages } from '../hooks/usePages'

import type { Page, PageQueryParams } from '../../types'
import type { UsePagesReturn } from '../hooks/usePages'

const PagesContext = createContext<UsePagesReturn | undefined>(undefined)

export const usePagesContext = () => {
  const context = useContext(PagesContext)

  if (!context) {
    throw new Error('usePagesContext must be used within PagesList')
  }

  return context
}

/**
 * PagesList Component
 * Main component for displaying CMS pages with table
 */
export const PagesList = () => {
  const pagesData = usePages()

  return (
    <PagesContext.Provider value={pagesData}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <PagesListTable />
        </Grid>
      </Grid>
    </PagesContext.Provider>
  )
}
