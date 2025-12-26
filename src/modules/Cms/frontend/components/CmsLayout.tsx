'use client'

import { useEffect, type ReactNode } from 'react'

import type { Mode } from '@core/types'

import { useSettings } from '@core/hooks/useSettings'

import CmsHeader from './CmsHeader'
import CmsFooter from './CmsFooter'

interface CmsLayoutProps {
  children: ReactNode
  mode: Mode
}

/**
 * CMS Layout Component
 * Provides the frontend layout for CMS pages with Header and Footer
 */
const CmsLayout = ({ children, mode }: CmsLayoutProps) => {
  const { updatePageSettings } = useSettings()

  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <CmsHeader mode={mode} />
      <main className='min-bs-[100dvh]'>{children}</main>
      <CmsFooter />
    </>
  )
}

export default CmsLayout
