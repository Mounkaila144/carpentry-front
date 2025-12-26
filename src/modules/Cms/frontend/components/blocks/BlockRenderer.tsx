'use client'

/**
 * Block Renderer Component
 * Dynamically renders blocks based on their type
 */

import type { Block } from '@/modules/Cms/types/block.types'

import HeroBlock from './HeroBlock'
import TextBlock from './TextBlock'
import HtmlBlock from './HtmlBlock'
import CtaBlock from './CtaBlock'
import FeaturesBlock from './FeaturesBlock'
import TestimonialsBlock from './TestimonialsBlock'
import GalleryBlock from './GalleryBlock'
import VideoBlock from './VideoBlock'
import ContactBlock from './ContactBlock'
import FaqBlock from './FaqBlock'
import PricingBlock from './PricingBlock'
import TeamBlock from './TeamBlock'
import StatsBlock from './StatsBlock'
import NewsletterBlock from './NewsletterBlock'

interface BlockRendererProps {
  block: Block
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block.is_active) return null

  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />
    case 'html':
      return <HtmlBlock block={block} />
    case 'hero':
      return <HeroBlock block={block} />
    case 'cta':
      return <CtaBlock block={block} />
    case 'features':
      return <FeaturesBlock block={block} />
    case 'testimonials':
      return <TestimonialsBlock block={block} />
    case 'gallery':
      return <GalleryBlock block={block} />
    case 'video':
      return <VideoBlock block={block} />
    case 'contact':
      return <ContactBlock block={block} />
    case 'faq':
      return <FaqBlock block={block} />
    case 'pricing':
      return <PricingBlock block={block} />
    case 'team':
      return <TeamBlock block={block} />
    case 'stats':
      return <StatsBlock block={block} />
    case 'newsletter':
      return <NewsletterBlock block={block} />
    default:
      console.warn(`Unknown block type: ${block.type}`)

      return null
  }
}
