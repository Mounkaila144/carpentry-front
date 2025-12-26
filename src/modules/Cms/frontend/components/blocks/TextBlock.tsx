'use client'

import { Card, CardContent, Typography } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface TextBlockProps {
  block: Block
}

export default function TextBlock({ block }: TextBlockProps) {
  const { content, settings } = block

  return (
    <Card
      sx={{
        backgroundColor: settings?.background_color || 'background.paper',
        color: settings?.text_color || 'text.primary'
      }}
    >
      <CardContent>
        {content.title && (
          <Typography variant='h4' component='h2' gutterBottom>
            {content.title}
          </Typography>
        )}
        {content.text && <Typography variant='body1'>{content.text}</Typography>}
      </CardContent>
    </Card>
  )
}
