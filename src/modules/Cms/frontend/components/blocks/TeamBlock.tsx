'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface TeamMember {
  name: string
  role: string
  bio?: string
  avatar?: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

interface TeamBlockProps {
  block: Block
}

export default function TeamBlock({ block }: TeamBlockProps) {
  const { content, settings } = block
  const members: TeamMember[] = content.members || []

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
          {members.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2
                    }}
                  />
                  <Typography variant='h6' component='h3' fontWeight='bold'>
                    {member.name}
                  </Typography>
                  <Typography variant='body2' color='primary' sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  {member.bio && (
                    <Typography variant='body2' color='text.secondary'>
                      {member.bio}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
