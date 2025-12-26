'use client'

import { useEffect } from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

import classnames from 'classnames'

import type { Mode } from '@core/types'

import type { Menu, MenuItem } from '../../types'

interface CmsMenuProps {
  mode: Mode
  menu: Menu
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

interface WrapperProps {
  children: React.ReactNode
  isBelowLgScreen: boolean
  className?: string
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

const Wrapper = (props: WrapperProps) => {
  const { children, isBelowLgScreen, className, isDrawerOpen, setIsDrawerOpen } = props

  if (isBelowLgScreen) {
    return (
      <Drawer
        variant='temporary'
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
        sx={{ '& .MuiDrawer-paper': { width: ['100%', 300] } }}
        className={classnames('p-5', className)}
      >
        <div className='p-4 flex flex-col gap-x-3'>
          <IconButton onClick={() => setIsDrawerOpen(false)} className='absolute inline-end-4 block-start-2'>
            <i className='ri-close-line' />
          </IconButton>
          {children}
        </div>
      </Drawer>
    )
  }

  return <div className={classnames('flex items-center flex-wrap gap-x-4 gap-y-3', className)}>{children}</div>
}

const CmsMenu = (props: CmsMenuProps) => {
  const { isDrawerOpen, setIsDrawerOpen, menu } = props

  const pathname = usePathname()
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  useEffect(() => {
    if (!isBelowLgScreen && isDrawerOpen) {
      setIsDrawerOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowLgScreen])

  // Safety check: return empty wrapper if no menu or no items
  if (!menu || !menu.items || menu.items.length === 0) {
    console.log('⚠️ CmsMenu: No menu or items available')

    return (
      <Wrapper isBelowLgScreen={isBelowLgScreen} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
        <div />
      </Wrapper>
    )
  }

  const renderMenuItem = (item: MenuItem) => {
    if (!item.is_active) return null

    // Priorité : url > page.slug > route > '#'
    let href = '#'

    if (item.url) {
      href = item.url
    } else if (item.page?.slug) {
      // Si le menu item est lié à une page CMS, utiliser son slug
      href = `/cms/${item.page.slug}`
    } else if (item.route) {
      href = item.route
    }

    const isActive = pathname === href

    console.log(`🔗 Menu Item: ${item.title}`, {
      url: item.url,
      route: item.route,
      page: item.page,
      pageSlug: item.page?.slug,
      finalHref: href,
      target: item.target,
      currentPath: pathname
    })

    // Si c'est un lien externe (commence par http), utiliser une balise <a>
    if (href.startsWith('http')) {
      return (
        <a
          key={item.id}
          href={href}
          target={item.target}
          className={classnames('font-medium plb-3 pli-1.5 hover:text-primary no-underline')}
          onClick={() => console.log(`🖱️ External link clicked: ${item.title} -> ${href}`)}
        >
          <Typography color='text.primary' className='font-medium'>
            {item.icon && <i className={classnames(item.icon, 'me-2')} />}
            {item.title}
          </Typography>
        </a>
      )
    }

    // Lien interne Next.js
    return (
      <Link
        key={item.id}
        href={href}
        target={item.target}
        className={classnames('font-medium plb-3 pli-1.5 hover:text-primary no-underline', {
          'text-primary': isActive
        })}
        onClick={(e) => {
          console.log(`🖱️ Internal link clicked: ${item.title} -> ${href}`)
          console.log('Event:', e)
        }}
      >
        <Typography
          color='text.primary'
          className={classnames('font-medium', {
            'text-primary': isActive
          })}
        >
          {item.icon && <i className={classnames(item.icon, 'me-2')} />}
          {item.title}
        </Typography>
      </Link>
    )
  }

  // Filter only top-level active items (no parent)
  const topLevelItems = menu.items.filter(item => !item.parent_id && item.is_active)

  console.log('📌 Top level items:', topLevelItems)

  return (
    <Wrapper isBelowLgScreen={isBelowLgScreen} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
      {topLevelItems.map(item => renderMenuItem(item))}
    </Wrapper>
  )
}

export default CmsMenu
