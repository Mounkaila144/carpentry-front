'use client'

import Link from 'next/link'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import classnames from 'classnames'

import type { Block } from '../../../types'

import frontCommonStyles from '@views/front-pages/styles.module.css'

interface HeroBlockProps {
  block: Block
}

/**
 * Hero Block Component
 * Displays a hero section with title, subtitle, and CTA button
 *
 * Expected content structure:
 * {
 *   title: string,
 *   subtitle: string,
 *   button_text: string,
 *   button_url: string,
 *   background_image?: string
 * }
 */
const HeroBlock = ({ block }: HeroBlockProps) => {
  const { content, settings } = block

  const title = content?.title || 'Welcome'
  const subtitle = content?.subtitle || ''
  const buttonText = content?.button_text || ''
  const buttonUrl = content?.button_url || '#'
  const backgroundImage = content?.background_image || settings?.background_image

  return (
    <section
      className={classnames('relative pbs-16 pbe-16 text-center bg-backgroundPaper', frontCommonStyles.layoutSpacing)}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' } : undefined}
    >
      <div className='max-is-[800px] mli-auto'>
        <Typography
          variant='h1'
          className='text-3xl sm:text-4xl lg:text-5xl font-extrabold mbe-4 text-primary'
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography variant='body1' className='text-lg mbe-8 text-textSecondary'>
            {subtitle}
          </Typography>
        )}

        {buttonText && (
          <Button
            component={Link}
            href={buttonUrl}
            variant='contained'
            size='large'
            color='primary'
          >
            {buttonText}
          </Button>
        )}
      </div>
    </section>
  )
}

export default HeroBlock
