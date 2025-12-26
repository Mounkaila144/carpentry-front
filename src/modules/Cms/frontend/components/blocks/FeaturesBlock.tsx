'use client'

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface Feature {
  title: string
  description: string
  icon?: string
}

interface FeaturesBlockProps {
  block: Block
}

export default function FeaturesBlock({ block }: FeaturesBlockProps) {
  const { content, settings } = block
  const features: Feature[] = content.features || []

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'background.default',
        py: 8
      }}
    >
      <Container maxWidth='lg'>
        {content.title && (
          <Typography variant='h3' component='h2' textAlign='center' gutterBottom fontWeight='bold'>
            {content.title}
          </Typography>
        )}
        {content.subtitle && (
          <Typography variant='h6' textAlign='center' color='text.secondary' sx={{ mb: 6 }}>
            {content.subtitle}
          </Typography>
        )}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  boxShadow: settings?.card_shadow || 2
                }}
              >
                <CardContent>
                  {feature.icon && (
                    <Box sx={{ fontSize: 48, mb: 2, color: settings?.icon_color || 'primary.main' }}>
                      <i className={feature.icon} />
                    </Box>
                  )}
                  <Typography variant='h5' component='h3' gutterBottom fontWeight='bold'>
                    {feature.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
