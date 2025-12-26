'use client'

import { Box } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface HtmlBlockProps {
  block: Block
}

export default function HtmlBlock({ block }: HtmlBlockProps) {
  const { content, settings } = block

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'transparent',
        color: settings?.text_color || 'text.primary',
        padding: settings?.padding || 0
      }}
      dangerouslySetInnerHTML={{ __html: content.html || '' }}
    />
  )
}
