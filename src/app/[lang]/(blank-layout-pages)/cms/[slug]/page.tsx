/**
 * Dynamic CMS Page Route
 * Publicly accessible pages without authentication
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import PageTemplate from '@/modules/Cms/frontend/components/templates/PageTemplate'
import { getPageBySlug } from '@/modules/Cms/frontend/services/pageService'

interface PageProps {
  params: {
    lang: string
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const page = await getPageBySlug(params.slug)

    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.excerpt,
      keywords: page.meta_keywords
    }
  } catch (error) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }
}

export default async function CmsPage({ params }: PageProps) {
  let page

  try {
    page = await getPageBySlug(params.slug)
  } catch (error) {
    notFound()
  }

  if (!page || !page.is_active || page.status !== 'published') {
    notFound()
  }

  return <PageTemplate page={page} />
}
