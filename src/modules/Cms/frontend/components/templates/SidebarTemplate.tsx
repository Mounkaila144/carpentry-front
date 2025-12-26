'use client'

import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material'

import type { Page } from '@/modules/Cms/types/page.types'

import BlockRenderer from '../blocks/BlockRenderer'

interface SidebarTemplateProps {
  page: Page
}

export default function SidebarTemplate({ page }: SidebarTemplateProps) {
  const sidebarBlocks = page.blocks?.filter(block => block.settings?.sidebar === true) || []
  const mainBlocks = page.blocks?.filter(block => !block.settings?.sidebar) || []

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth='lg'>
        <Typography variant='h2' component='h1' gutterBottom fontWeight='bold'>
          {page.title}
        </Typography>

        {page.excerpt && (
          <Typography variant='h6' color='text.secondary' sx={{ mb: 4 }}>
            {page.excerpt}
          </Typography>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {page.content && (
              <Box
                sx={{ mb: 4 }}
                dangerouslySetInnerHTML={{ __html: page.content }}
                className='cms-content'
              />
            )}

            {mainBlocks.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {mainBlocks.map((block, index) => (
                  <BlockRenderer key={block.id || index} block={block} />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              {sidebarBlocks.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {sidebarBlocks.map((block, index) => (
                    <BlockRenderer key={block.id || index} block={block} />
                  ))}
                </Box>
              ) : (
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      About
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {page.excerpt || 'Additional information about this page.'}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
