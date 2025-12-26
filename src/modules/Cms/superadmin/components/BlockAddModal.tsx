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

import { blockService } from '../services/blockService'

import type { CreateBlockPayload, BlockType } from '../../types'

const BLOCK_TYPES: BlockType[] = [
  'text',
  'html',
  'hero',
  'cta',
  'features',
  'testimonials',
  'gallery',
  'video',
  'contact',
  'faq',
  'pricing',
  'team',
  'stats',
  'newsletter'
]

interface BlockAddModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const BlockAddModal = ({ open, onClose, onSuccess }: BlockAddModalProps) => {
  const { tenantId } = useTenant()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateBlockPayload>({
    name: '',
    identifier: '',
    type: 'text',
    content: {},
    settings: {},
    page_id: null,
    order: 0,
    is_active: true
  })

  const handleFieldChange = (field: keyof CreateBlockPayload, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate identifier from name
    if (field === 'name' && !formData.identifier) {
      const identifier = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      setFormData(prev => ({ ...prev, identifier }))
    }
  }

  const handleContentChange = (value: string) => {
    try {
      const content = JSON.parse(value)

      setFormData(prev => ({ ...prev, content }))
    } catch (err) {
      // Invalid JSON, keep as is
    }
  }

  const handleSettingsChange = (value: string) => {
    try {
      const settings = JSON.parse(value)

      setFormData(prev => ({ ...prev, settings }))
    } catch (err) {
      // Invalid JSON, keep as is
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      await blockService.createBlock(formData, tenantId)

      onSuccess()
      handleClose()
    } catch (err: any) {
      console.error('Error creating block:', err)
      setError(err?.response?.data?.message || 'Failed to create block')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      identifier: '',
      type: 'text',
      content: {},
      settings: {},
      page_id: null,
      order: 0,
      is_active: true
    })
    setError(null)
    onClose()
  }

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.identifier.trim() !== ''
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle className='flex items-center justify-between'>
        <div>
          <Typography variant='h5'>Add New Block</Typography>
          <Typography variant='body2' color='text.secondary'>
            Fill in the information to create a new content block
          </Typography>
        </div>
        <IconButton onClick={handleClose} size='small'>
          <i className='ri-close-line' />
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
            <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
              <Typography variant='h6'>Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label='Name'
                    value={formData.name}
                    onChange={e => handleFieldChange('name', e.target.value)}
                    helperText='Required field'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label='Identifier'
                    value={formData.identifier}
                    onChange={e => handleFieldChange('identifier', e.target.value)}
                    helperText='Unique identifier (e.g., hero-home)'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Block Type</InputLabel>
                    <Select
                      value={formData.type}
                      label='Block Type'
                      onChange={e => handleFieldChange('type', e.target.value as BlockType)}
                    >
                      {BLOCK_TYPES.map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label='Content (JSON)'
                    defaultValue={JSON.stringify(formData.content, null, 2)}
                    onChange={e => handleContentChange(e.target.value)}
                    helperText='Block content as JSON object'
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Block Settings */}
          <Accordion>
            <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
              <Typography variant='h6'>Block Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Settings (JSON)'
                    defaultValue={JSON.stringify(formData.settings, null, 2)}
                    onChange={e => handleSettingsChange(e.target.value)}
                    helperText='Block settings as JSON object (colors, styles, etc.)'
                  />
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Page ID (optional)'
                    value={formData.page_id || ''}
                    onChange={e => handleFieldChange('page_id', e.target.value ? parseInt(e.target.value) : null)}
                    helperText='Leave empty for global blocks'
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
          {loading ? <CircularProgress size={20} /> : 'Create Block'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BlockAddModal
