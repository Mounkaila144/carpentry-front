'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'

import type { Block } from '@/modules/Cms/types/block.types'

interface CtaBlockProps {
  block: Block
}

export default function CtaBlock({ block }: CtaBlockProps) {
  const { content, settings } = block

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'primary.main',
        color: settings?.text_color || 'primary.contrastText',
        py: 6
      }}
    >
      <Container maxWidth='lg'>
        <Box sx={{ textAlign: 'center' }}>
          {content.title && (
            <Typography variant='h3' component='h2' gutterBottom fontWeight='bold'>
              {content.title}
            </Typography>
          )}
          {content.description && (
            <Typography variant='h6' sx={{ mb: 4, opacity: 0.9 }}>
              {content.description}
            </Typography>
          )}
          {content.button_text && content.button_url && (
            <Button
              component={Link}
              href={content.button_url}
              variant='contained'
              size='large'
              sx={{
                backgroundColor: settings?.button_color || 'secondary.main',
                color: settings?.button_text_color || 'secondary.contrastText',
                '&:hover': {
                  backgroundColor: settings?.button_hover_color || 'secondary.dark'
                }
              }}
            >
              {content.button_text}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  )
}
