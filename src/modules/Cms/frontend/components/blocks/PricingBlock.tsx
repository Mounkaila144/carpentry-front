'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText } from '@mui/material'
import Link from 'next/link'

import type { Block } from '@/modules/Cms/types/block.types'

interface PricingPlan {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  button_text?: string
  button_url?: string
  featured?: boolean
}

interface PricingBlockProps {
  block: Block
}

export default function PricingBlock({ block }: PricingBlockProps) {
  const { content, settings } = block
  const plans: PricingPlan[] = content.plans || []

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
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: plan.featured ? 2 : 1,
                  borderColor: plan.featured ? 'primary.main' : 'divider',
                  position: 'relative'
                }}
              >
                {plan.featured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      px: 2,
                      py: 0.5,
                      borderBottomLeftRadius: 8
                    }}
                  >
                    <Typography variant='caption' fontWeight='bold'>
                      Popular
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant='h5' component='h3' gutterBottom fontWeight='bold'>
                    {plan.name}
                  </Typography>
                  {plan.description && (
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                      {plan.description}
                    </Typography>
                  )}
                  <Typography variant='h3' component='div' sx={{ my: 3 }}>
                    {plan.price}
                    {plan.period && (
                      <Typography variant='body2' component='span' color='text.secondary'>
                        {' '}
                        / {plan.period}
                      </Typography>
                    )}
                  </Typography>
                  <List sx={{ textAlign: 'left' }}>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} sx={{ py: 0.5 }}>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                  {plan.button_text && plan.button_url && (
                    <Button
                      component={Link}
                      href={plan.button_url}
                      variant={plan.featured ? 'contained' : 'outlined'}
                      size='large'
                      fullWidth
                      sx={{ mt: 3 }}
                    >
                      {plan.button_text}
                    </Button>
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
