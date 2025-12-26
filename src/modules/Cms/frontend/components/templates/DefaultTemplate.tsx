'use client'

import { Container, Typography, Box } from '@mui/material'

import type { Page } from '@/modules/Cms/types/page.types'

import BlockRenderer from '../blocks/BlockRenderer'

interface DefaultTemplateProps {
  page: Page
}

export default function DefaultTemplate({ page }: DefaultTemplateProps) {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth='lg'>
        {page.featured_image && (
          <Box
            sx={{
              width: '100%',
              height: 400,
              backgroundImage: `url(${page.featured_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              mb: 4
            }}
          />
        )}

        <Typography variant='h2' component='h1' gutterBottom fontWeight='bold'>
          {page.title}
        </Typography>

        {page.excerpt && (
          <Typography variant='h6' color='text.secondary' sx={{ mb: 4 }}>
            {page.excerpt}
          </Typography>
        )}

        {page.content && (
          <Box
            sx={{ mb: 6 }}
            dangerouslySetInnerHTML={{ __html: page.content }}
            className='cms-content'
          />
        )}

        {page.blocks && page.blocks.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {page.blocks.map((block, index) => (
              <BlockRenderer key={block.id || index} block={block} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}
