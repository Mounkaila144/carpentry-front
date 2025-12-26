'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface Testimonial {
  name: string
  role: string
  company?: string
  avatar?: string
  quote: string
}

interface TestimonialsBlockProps {
  block: Block
}

export default function TestimonialsBlock({ block }: TestimonialsBlockProps) {
  const { content, settings } = block
  const testimonials: Testimonial[] = content.testimonials || []

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'background.paper',
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
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant='body1' color='text.secondary' sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={testimonial.avatar} alt={testimonial.name} />
                    <Box>
                      <Typography variant='subtitle1' fontWeight='bold'>
                        {testimonial.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
