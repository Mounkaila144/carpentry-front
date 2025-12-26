'use client'

import { createContext, useContext } from 'react'

import Grid from '@mui/material/Grid2'

import MenuItemsListTable from './MenuItemsListTable'
import { useMenuItems } from '../hooks/useMenuItems'

import type { UseMenuItemsReturn } from '../hooks/useMenuItems'

const MenuItemsContext = createContext<UseMenuItemsReturn | undefined>(undefined)

export const useMenuItemsContext = () => {
  const context = useContext(MenuItemsContext)

  if (!context) {
    throw new Error('useMenuItemsContext must be used within MenuItemsList')
  }

  return context
}

/**
 * MenuItemsList Component
 * Main component for displaying CMS menu items with table
 */
export const MenuItemsList = () => {
  const menuItemsData = useMenuItems()

  return (
    <MenuItemsContext.Provider value={menuItemsData}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <MenuItemsListTable />
        </Grid>
    </Grid>
    </MenuItemsContext.Provider>
  )
}
