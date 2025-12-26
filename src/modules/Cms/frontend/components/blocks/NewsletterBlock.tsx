'use client'

import { useState } from 'react'

import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface NewsletterBlockProps {
  block: Block
}

export default function NewsletterBlock({ block }: NewsletterBlockProps) {
  const { content, settings } = block
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email)
  }

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'primary.main',
        color: settings?.text_color || 'primary.contrastText',
        py: 8
      }}
    >
      <Container maxWidth='md'>
        {content.title && (
          <Typography variant='h3' component='h2' textAlign='center' gutterBottom fontWeight='bold'>
            {content.title}
          </Typography>
        )}
        {content.subtitle && (
          <Typography variant='h6' textAlign='center' sx={{ mb: 4, opacity: 0.9 }}>
            {content.subtitle}
          </Typography>
        )}
        <Box component='form' onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type='submit'
                variant='contained'
                size='large'
                fullWidth
                sx={{
                  backgroundColor: settings?.button_color || 'secondary.main',
                  color: settings?.button_text_color || 'secondary.contrastText',
                  height: '56px'
                }}
              >
                {content.button_text || 'Subscribe'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
