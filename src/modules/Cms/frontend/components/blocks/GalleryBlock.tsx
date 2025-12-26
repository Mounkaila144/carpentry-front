'use client'

import { Box, Container, Typography, Grid } from '@mui/material'
import Image from 'next/image'

import type { Block } from '@/modules/Cms/types/block.types'

interface GalleryImage {
  url: string
  alt: string
  caption?: string
}

interface GalleryBlockProps {
  block: Block
}

export default function GalleryBlock({ block }: GalleryBlockProps) {
  const { content, settings } = block
  const images: GalleryImage[] = content.images || []

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
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '75%',
                  overflow: 'hidden',
                  borderRadius: settings?.border_radius || 2
                }}
              >
                <Image src={image.url} alt={image.alt} fill style={{ objectFit: 'cover' }} />
              </Box>
              {image.caption && (
                <Typography variant='caption' display='block' textAlign='center' sx={{ mt: 1 }}>
                  {image.caption}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
