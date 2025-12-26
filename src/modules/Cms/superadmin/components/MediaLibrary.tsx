'use client'

import { useState, useRef, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'

import { useMedia } from '../hooks/useMedia'

const getMediaUrl = (path: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ''

  return `${backendUrl}/storage/${path}`
}

export const MediaLibrary = () => {
  const { media, loading, error, setSearch, refresh, deleteMedia, uploadMedia } = useMedia()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopyLink = useCallback(async (mediaId: number, path: string) => {
    const url = getMediaUrl(path)

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textArea = document.createElement('textarea')

        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setCopiedId(mediaId)

      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    try {
      setUploading(true)
      setUploadError(null)

      for (const file of Array.from(files)) {
        await uploadMedia(file)
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload files')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (mediaId: number) => {
    if (confirm('Are you sure you want to delete this media file?')) {
      try {
        await deleteMedia(mediaId)
      } catch (err) {
        alert('Failed to delete media file')
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            Media Library
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Upload and manage your media files
          </Typography>
        </Box>

        {uploadError && (
          <Alert severity='error' onClose={() => setUploadError(null)} sx={{ mb: 3 }}>
            {uploadError}
          </Alert>
        )}

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            size='small'
            placeholder='Search media...'
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='image/*,video/*,application/pdf'
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Button
            variant='contained'
            startIcon={uploading ? <CircularProgress size={16} /> : <i className='ri-upload-line' />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
          <Button variant='outlined' color='secondary' onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </Box>

        {loading && media.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : media.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color='text.secondary'>No media files found</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {media.map(item => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card variant='outlined' sx={{ position: 'relative', height: '100%' }}>
                  <Box sx={{ position: 'relative', paddingTop: '100%', bgcolor: 'action.hover' }}>
                    {item.is_image ? (
                      <Box
                        component='img'
                        src={getMediaUrl(item.path)}
                        alt={item.alt || item.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className='ri-file-line' style={{ fontSize: 48, opacity: 0.3 }} />
                      </Box>
                    )}
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                      <Tooltip title={copiedId === item.id ? 'Copied!' : 'Copy link'}>
                        <IconButton
                          size='small'
                          onClick={() => handleCopyLink(item.id, item.path)}
                          sx={{
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                          }}
                        >
                          <i className={copiedId === item.id ? 'ri-check-line' : 'ri-link'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton
                          size='small'
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                          }}
                        >
                          <i className='ri-delete-bin-line' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5 }}>
                    <Typography variant='body2' noWrap fontWeight='medium' title={item.name}>
                      {item.name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {item.human_size}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
