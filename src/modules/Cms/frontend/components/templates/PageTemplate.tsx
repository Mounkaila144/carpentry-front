'use client'

/**
 * Main Page Template Component
 * Renders page content with blocks based on template type
 */

import type { Page } from '@/modules/Cms/types/page.types'

import DefaultTemplate from './DefaultTemplate'
import HomeTemplate from './HomeTemplate'
import ContactTemplate from './ContactTemplate'
import LandingTemplate from './LandingTemplate'
import FullWidthTemplate from './FullWidthTemplate'
import SidebarTemplate from './SidebarTemplate'

interface PageTemplateProps {
  page: Page
}

export default function PageTemplate({ page }: PageTemplateProps) {
  switch (page.template) {
    case 'home':
      return <HomeTemplate page={page} />
    case 'contact':
      return <ContactTemplate page={page} />
    case 'landing':
      return <LandingTemplate page={page} />
    case 'full-width':
      return <FullWidthTemplate page={page} />
    case 'sidebar':
      return <SidebarTemplate page={page} />
    case 'default':
    default:
      return <DefaultTemplate page={page} />
  }
}
