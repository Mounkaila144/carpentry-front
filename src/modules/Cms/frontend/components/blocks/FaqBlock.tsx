'use client'

import { useState } from 'react'

import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

import type { Block } from '@/modules/Cms/types/block.types'

interface FaqItem {
  question: string
  answer: string
}

interface FaqBlockProps {
  block: Block
}

export default function FaqBlock({ block }: FaqBlockProps) {
  const { content, settings } = block
  const faqs: FaqItem[] = content.faqs || []
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Box
      sx={{
        backgroundColor: settings?.background_color || 'background.default',
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
        {faqs.map((faq, index) => (
          <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
            <AccordionSummary>
              <Typography fontWeight='bold'>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color='text.secondary'>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  )
}
