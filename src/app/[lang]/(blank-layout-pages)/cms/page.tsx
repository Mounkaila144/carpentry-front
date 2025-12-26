/**
 * CMS Home Page
 * Displays the home page from CMS
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import PageTemplate from '@/modules/Cms/frontend/components/templates/PageTemplate'
import { getHomePage } from '@/modules/Cms/frontend/services/pageService'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomePage()

    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.excerpt,
      keywords: page.meta_keywords
    }
  } catch (error) {
    return {
      title: 'Home',
      description: 'Welcome to our website.'
    }
  }
}

export default async function CmsHomePage() {
  let page

  try {
    page = await getHomePage()
  } catch (error) {
    notFound()
  }

  if (!page || !page.is_active || page.status !== 'published') {
    notFound()
  }

  return <PageTemplate page={page} />
}
