'use client'

import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid2'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { useTenant } from '@/shared/lib/tenant-context'

import { pageService } from '../services/pageService'

import type { CreatePagePayload, PageStatus, PageTemplate } from '../../types'

const TEMPLATES: PageTemplate[] = ['default', 'home', 'contact', 'landing', 'full-width', 'sidebar']
const STATUSES: PageStatus[] = ['draft', 'published', 'archived']

interface PageAddModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const PageAddModal = ({ open, onClose, onSuccess }: PageAddModalProps) => {
  const { tenantId } = useTenant()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreatePagePayload>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    template: 'default',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    featured_image: '',
    parent_id: null,
    status: 'draft',
    order: 0,
    is_active: true
  })

  const handleFieldChange = (field: keyof CreatePagePayload, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      await pageService.createPage(formData, tenantId)

      onSuccess()
      handleClose()
    } catch (err: any) {
      console.error('Error creating page:', err)
      setError(err?.response?.data?.message || 'Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      template: 'default',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      featured_image: '',
      parent_id: null,
      status: 'draft',
      order: 0,
      is_active: true
    })
    setError(null)
    onClose()
  }

  const isFormValid = () => {
    return formData.title.trim() !== ''
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle className='flex items-center justify-between'>
        <div>
          <Typography variant='h5'>Add New Page</Typography>
          <Typography variant='body2' color='text.secondary'>
            Fill in the information to create a new page
          </Typography>
        </div>
        <IconButton onClick={handleClose} size='small'>
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className='space-y-4'>
          {error && (
            <Alert severity='error' onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Basic Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<i className='tabler-chevron-down' />}>
              <Typography variant='h6'>Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label='Title'
                    value={formData.title}
                    onChange={e => handleFieldChange('title', e.target.value)}
                    helperText='Required field'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Slug'
                    value={formData.slug}
                    onChange={e => handleFieldChange('slug', e.target.value)}
                    helperText='URL-friendly version of the title'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Template</InputLabel>
                    <Select
                      value={formData.template}
                      label='Template'
                      onChange={e => handleFieldChange('template', e.target.value as PageTemplate)}
                    >
                      {TEMPLATES.map(template => (
                        <MenuItem key={template} value={template}>
                          {template}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label='Excerpt'
                    value={formData.excerpt}
                    onChange={e => handleFieldChange('excerpt', e.target.value)}
                    helperText='Short description'
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label='Content'
                    value={formData.content}
                    onChange={e => handleFieldChange('content', e.target.value)}
                    helperText='HTML content of the page'
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* SEO Settings */}
          <Accordion>
            <AccordionSummary expandIcon={<i className='tabler-chevron-down' />}>
              <Typography variant='h6'>SEO Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label='Meta Title'
                    value={formData.meta_title}
                    onChange={e => handleFieldChange('meta_title', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label='Meta Description'
                    value={formData.meta_description}
                    onChange={e => handleFieldChange('meta_description', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label='Meta Keywords'
                    value={formData.meta_keywords}
                    onChange={e => handleFieldChange('meta_keywords', e.target.value)}
                    helperText='Comma separated'
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Page Settings */}
          <Accordion>
            <AccordionSummary expandIcon={<i className='tabler-chevron-down' />}>
              <Typography variant='h6'>Page Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label='Status'
                      onChange={e => handleFieldChange('status', e.target.value as PageStatus)}
                    >
                      {STATUSES.map(status => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Order'
                    value={formData.order}
                    onChange={e => handleFieldChange('order', parseInt(e.target.value) || 0)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label='Featured Image URL'
                    value={formData.featured_image}
                    onChange={e => handleFieldChange('featured_image', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={e => handleFieldChange('is_active', e.target.checked)}
                      />
                    }
                    label='Active'
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose} color='secondary' disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={!isFormValid() || loading}>
          {loading ? <CircularProgress size={20} /> : 'Create Page'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PageAddModal
