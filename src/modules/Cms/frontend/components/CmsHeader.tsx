'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

import classnames from 'classnames'

import type { Mode } from '@core/types'

import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import CustomIconButton from '@core/components/mui/IconButton'

import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

import { menuService } from '../services/menuService'

import type { Menu } from '../../types'

import CmsMenu from './CmsMenu'

import styles from '@components/layout/front-pages/styles.module.css'

interface CmsHeaderProps {
  mode: Mode
}

const CmsHeader = ({ mode }: CmsHeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [headerMenu, setHeaderMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)

  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  useEffect(() => {
    const fetchHeaderMenu = async () => {
      try {
        setLoading(true)
        const menu = await menuService.getMenuByLocation('header')

        console.log('📋 Header Menu fetched:', menu)
        console.log('📋 Menu items:', menu?.items)

        if (menu && menu.is_active) {
          setHeaderMenu(menu)
        }
      } catch (err) {
        console.error('❌ Error fetching header menu:', err)
        setHeaderMenu(null)
      } finally {
        setLoading(false)
      }
    }

    fetchHeaderMenu()
  }, [])

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            <div className='flex items-center gap-2 sm:gap-4'>
              <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                <i className='ri-menu-line' />
              </IconButton>
              <Link href='/cms'>
                <Logo />
              </Link>
              {headerMenu && !loading && (
                <CmsMenu mode={mode} menu={headerMenu} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              )}
            </div>
          ) : (
            <div className='flex items-center gap-10'>
              <Link href='/cms'>
                <Logo />
              </Link>
              {headerMenu && !loading && (
                <CmsMenu mode={mode} menu={headerMenu} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              )}
            </div>
          )}
          <div className='flex items-center gap-2 sm:gap-4'>
            <ModeDropdown />
            {isBelowLgScreen ? (
              <CustomIconButton component={Link} variant='contained' href='/login' color='primary'>
                <i className='ri-user-line text-xl' />
              </CustomIconButton>
            ) : (
              <Button
                component={Link}
                variant='contained'
                href='/login'
                startIcon={<i className='ri-user-line text-xl' />}
                className='whitespace-nowrap'
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default CmsHeader
