'use client'

import { createContext, useContext } from 'react'

import Grid from '@mui/material/Grid2'

import MenusListTable from './MenusListTable'
import { useMenus } from '../hooks/useMenus'

import type { UseMenusReturn } from '../hooks/useMenus'

const MenusContext = createContext<UseMenusReturn | undefined>(undefined)

export const useMenusContext = () => {
  const context = useContext(MenusContext)

  if (!context) {
    throw new Error('useMenusContext must be used within MenusList')
  }

  return context
}

/**
 * MenusList Component
 * Main component for displaying CMS menus with table
 */
export const MenusList = () => {
  const menusData = useMenus()

  return (
    <MenusContext.Provider value={menusData}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <MenusListTable />
        </Grid>
      </Grid>
    </MenusContext.Provider>
  )
}
