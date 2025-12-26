'use client'

import { Box } from '@mui/material'

import type { Page } from '@/modules/Cms/types/page.types'

import BlockRenderer from '../blocks/BlockRenderer'

interface HomeTemplateProps {
  page: Page
}

export default function HomeTemplate({ page }: HomeTemplateProps) {
  return (
    <Box>
      {page.blocks && page.blocks.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {page.blocks.map((block, index) => (
            <BlockRenderer key={block.id || index} block={block} />
          ))}
        </Box>
      )}

      {page.content && (
        <Box
          sx={{ py: 8, px: 2 }}
          dangerouslySetInnerHTML={{ __html: page.content }}
          className='cms-content'
        />
      )}
    </Box>
  )
}
