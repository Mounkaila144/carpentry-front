'use client'

import { Container, Typography, Box, Grid } from '@mui/material'

import type { Page } from '@/modules/Cms/types/page.types'

import BlockRenderer from '../blocks/BlockRenderer'

interface ContactTemplateProps {
  page: Page
}

export default function ContactTemplate({ page }: ContactTemplateProps) {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth='lg'>
        <Typography variant='h2' component='h1' gutterBottom fontWeight='bold' textAlign='center'>
          {page.title}
        </Typography>

        {page.excerpt && (
          <Typography variant='h6' color='text.secondary' textAlign='center' sx={{ mb: 6 }}>
            {page.excerpt}
          </Typography>
        )}

        <Grid container spacing={6}>
          {page.content && (
            <Grid item xs={12} md={6}>
              <Box
                dangerouslySetInnerHTML={{ __html: page.content }}
                className='cms-content'
              />
            </Grid>
          )}

          <Grid item xs={12} md={page.content ? 6 : 12}>
            {page.blocks && page.blocks.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {page.blocks.map((block, index) => (
                  <BlockRenderer key={block.id || index} block={block} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
