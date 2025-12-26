'use client'

import { useState } from 'react'

import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface ContactBlockProps {
  block: Block
}

export default function ContactBlock({ block }: ContactBlockProps) {
  const { content, settings } = block
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'background.paper',
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
          <Typography variant='h6' textAlign='center' color='text.secondary' sx={{ mb: 6 }}>
            {content.subtitle}
          </Typography>
        )}
        <Box component='form' onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Message'
                name='message'
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                size='large'
                fullWidth
                sx={{
                  backgroundColor: settings?.button_color || 'primary.main'
                }}
              >
                {content.button_text || 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
