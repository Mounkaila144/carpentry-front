'use client'

import { Box, Container, Typography, Grid } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface Stat {
  value: string
  label: string
  description?: string
}

interface StatsBlockProps {
  block: Block
}

export default function StatsBlock({ block }: StatsBlockProps) {
  const { content, settings } = block
  const stats: Stat[] = content.stats || []

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'primary.main',
        color: settings?.text_color || 'primary.contrastText',
        py: 8
      }}
    >
      <Container maxWidth='lg'>
        {content.title && (
          <Typography variant='h3' component='h2' textAlign='center' gutterBottom fontWeight='bold'>
            {content.title}
          </Typography>
        )}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h2' component='div' fontWeight='bold' sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant='h6' sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
                {stat.description && (
                  <Typography variant='body2' sx={{ opacity: 0.7, mt: 1 }}>
                    {stat.description}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
