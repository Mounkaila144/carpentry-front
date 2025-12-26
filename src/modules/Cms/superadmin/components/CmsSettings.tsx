'use client'

import { useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import { useTenant } from '@/shared/lib/tenant-context'

import { settingsService } from '../services/settingsService'

import type { Setting } from '../../types'

export const CmsSettings = () => {
  const { tenantId } = useTenant()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [settingsByGroup, setSettingsByGroup] = useState<{ [group: string]: Setting[] }>({})
  const [editedValues, setEditedValues] = useState<{ [key: string]: { value: string; is_public: boolean } }>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsService.getSettings(tenantId)

      setSettingsByGroup(response.data)

      // Initialize edited values
      const initialValues: { [key: string]: { value: string; is_public: boolean } } = {}

      Object.values(response.data)
        .flat()
        .forEach(setting => {
          initialValues[setting.key] = {
            value: setting.value,
            is_public: setting.is_public
          }
        })
      setEditedValues(initialValues)
    } catch (err: any) {
      setError(err?.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const updates = Object.entries(editedValues).map(([key, data]) => ({
        key,
        value: data.value
      }))

      await settingsService.bulkUpdateSettings({ settings: updates }, tenantId)

      setSuccess(true)
      await fetchSettings()
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }))
  }

  const handlePublicChange = (key: string, is_public: boolean) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: { ...prev[key], is_public }
    }))
  }

  const renderSettingInput = (setting: Setting) => {
    const currentValue = editedValues[setting.key]?.value ?? setting.value

    switch (setting.type) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={currentValue === 'true' || currentValue === '1'}
                onChange={e => handleValueChange(setting.key, e.target.checked ? 'true' : 'false')}
              />
            }
            label={setting.key}
          />
        )
      case 'integer':
      case 'float':
        return (
          <TextField
            fullWidth
            type='number'
            label={setting.key}
            value={currentValue}
            onChange={e => handleValueChange(setting.key, e.target.value)}
            helperText={`Type: ${setting.type} | Public: ${setting.is_public ? 'Yes' : 'No'}`}
          />
        )
      case 'json':
      case 'array':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={setting.key}
            value={currentValue}
            onChange={e => handleValueChange(setting.key, e.target.value)}
            helperText={`Type: ${setting.type} | Public: ${setting.is_public ? 'Yes' : 'No'}`}
          />
        )
      default:
        return (
          <TextField
            fullWidth
            label={setting.key}
            value={currentValue}
            onChange={e => handleValueChange(setting.key, e.target.value)}
            helperText={`Type: ${setting.type} | Public: ${setting.is_public ? 'Yes' : 'No'}`}
          />
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            CMS Settings
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Configure your CMS settings
          </Typography>
        </Box>

        {error && (
          <Alert severity='error' onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity='success' onClose={() => setSuccess(false)} sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          {Object.keys(settingsByGroup).length === 0 ? (
            <Typography color='text.secondary'>No settings found</Typography>
          ) : (
            Object.entries(settingsByGroup).map(([group, settings]) => (
              <Accordion key={group} defaultExpanded={group === 'general'}>
                <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                  <Typography variant='h6' sx={{ textTransform: 'capitalize' }}>
                    {group}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {settings.map(setting => (
                      <Grid key={setting.id} size={{ xs: 12 }}>
                        {renderSettingInput(setting)}
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant='outlined' onClick={fetchSettings} disabled={saving}>
            Reset
          </Button>
          <Button variant='contained' onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Save Settings'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
