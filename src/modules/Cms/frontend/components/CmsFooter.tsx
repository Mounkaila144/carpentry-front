'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import classnames from 'classnames'

import Logo from '@components/layout/shared/Logo'

import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

import { menuService } from '../services/menuService'

import type { Menu, MenuItem } from '../../types'

import styles from '@components/layout/front-pages/styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const CmsFooter = () => {
  const [footerMenu, setFooterMenu] = useState<Menu | null>(null)

  useEffect(() => {
    const fetchFooterMenu = async () => {
      try {
        const menu = await menuService.getMenuByLocation('footer')

        if (menu && menu.is_active) {
          setFooterMenu(menu)
        }
      } catch (err) {
        console.error('Error fetching footer menu:', err)
      }
    }

    fetchFooterMenu()
  }, [])

  const renderMenuItem = (item: MenuItem) => {
    if (!item.is_active) return null

    let href = '#'

    if (item.url) {
      href = item.url
    } else if (item.page?.slug) {
      href = `/cms/${item.page.slug}`
    } else if (item.route) {
      href = item.route
    }

    return (
      <Typography
        key={item.id}
        component={Link}
        href={href}
        target={item.target}
        color='white'
        className='opacity-[0.78]'
      >
        {item.title}
      </Typography>
    )
  }

  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img
          src='/images/front-pages/footer-bg.png'
          alt='footer bg'
          className='absolute inset-0 is-full bs-full object-cover -z-[1]'
        />
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/cms'>
                  <Logo color='var(--mui-palette-common-white)' />
                </Link>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  Bienvenue sur notre site. Découvrez nos services et notre contenu.
                </Typography>
              </div>
            </Grid>

            {footerMenu && footerMenu.items && footerMenu.items.length > 0 && (
              <Grid size={{ xs: 12, sm: 3, lg: 2 }}>
                <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                  {footerMenu.name || 'Links'}
                </Typography>
                <div className='flex flex-col gap-4'>
                  {footerMenu.items
                    .filter(item => !item.parent_id && item.is_active)
                    .map(item => renderMenuItem(item))}
                </div>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 3, lg: 2 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Contact
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/cms/contact' color='white' className='opacity-[0.78]'>
                  Contactez-nous
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className='bg-[#211B2C]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[15px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <Typography className='text-white opacity-[0.92]' variant='body2'>
            <span>{`© ${new Date().getFullYear()}, Made with `}</span>
            <span>{`❤️`}</span>
            <span>{` by `}</span>
            <Link href='/' className='font-medium text-white'>
              Your Company
            </Link>
          </Typography>
          <div className='flex gap-1.5 items-center opacity-[0.78]'>
            <IconButton component={Link} size='small' href='#' target='_blank'>
              <i className='ri-facebook-fill text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='#' target='_blank'>
              <i className='ri-twitter-fill text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='#' target='_blank'>
              <i className='ri-linkedin-fill text-white text-lg' />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CmsFooter
