'use client'

import { Typography, Box } from '@mui/material'

import type { Page } from '@/modules/Cms/types/page.types'

import BlockRenderer from '../blocks/BlockRenderer'

interface FullWidthTemplateProps {
  page: Page
}

export default function FullWidthTemplate({ page }: FullWidthTemplateProps) {
  return (
    <Box>
      {page.featured_image && (
        <Box
          sx={{
            width: '100%',
            height: 500,
            backgroundImage: `url(${page.featured_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2 }}>
            <Typography variant='h2' component='h1' fontWeight='bold'>
              {page.title}
            </Typography>
            {page.excerpt && (
              <Typography variant='h5' sx={{ mt: 2 }}>
                {page.excerpt}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {page.content && (
        <Box
          sx={{ py: 8, px: 2 }}
          dangerouslySetInnerHTML={{ __html: page.content }}
          className='cms-content'
        />
      )}

      {page.blocks && page.blocks.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {page.blocks.map((block, index) => (
            <BlockRenderer key={block.id || index} block={block} />
          ))}
        </Box>
      )}
    </Box>
  )
}
