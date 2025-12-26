'use client'

import { Box, Container, Typography } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface VideoBlockProps {
  block: Block
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const { content, settings } = block

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
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
            mt: 4,
            borderRadius: settings?.border_radius || 2,
            overflow: 'hidden'
          }}
        >
          <iframe
            src={content.video_url}
            title={content.title || 'Video'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0
            }}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </Box>
      </Container>
    </Box>
  )
}
