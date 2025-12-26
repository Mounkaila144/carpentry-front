'use client'

import { useState, useMemo, useCallback } from 'react'

import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { ThemeColor } from '@core/types'
import type { Page, PageStatus } from '../../types'

import { DataTable, StandardMobileCard } from '@/components/shared/DataTable'
import type { ColumnConfig } from '@/components/shared/DataTable'

import { usePagesContext } from './PagesList'
import PageAddModal from './PageAddModal'
import PageEditModal from './PageEditModal'

type PageWithAction = Page & {
  action?: string
}

type PageStatusColor = {
  [key in PageStatus]: ThemeColor
}

const pageStatusColors: PageStatusColor = {
  draft: 'warning',
  published: 'success',
  archived: 'secondary'
}

const AVAILABLE_COLUMNS: ColumnConfig[] = [
  { id: 'title', label: 'Title', defaultVisible: true },
  { id: 'slug', label: 'Slug', defaultVisible: true },
  { id: 'template', label: 'Template', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'is_active', label: 'Active', defaultVisible: true },
  { id: 'order', label: 'Order', defaultVisible: false },
  { id: 'created_at', label: 'Created At', defaultVisible: true }
]

const STORAGE_KEY = 'pagesListTableColumns'

const columnHelper = createColumnHelper<PageWithAction>()

const PagesListTable = () => {
  const {
    pages,
    loading,
    pagination,
    params,
    setPage,
    setPageSize,
    setSearch,
    updateParams,
    refresh,
    deletePage,
    publishPage,
    unpublishPage,
    duplicatePage
  } = usePagesContext()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}

    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return {}
      }
    }

    return AVAILABLE_COLUMNS.reduce(
      (acc, col) => {
        acc[col.id] = col.defaultVisible

        return acc
      },
      {} as Record<string, boolean>
    )
  })

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setColumnVisibility(prev => {
      const newVisibility = { ...prev, [columnId]: visible }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility))

      return newVisibility
    })
  }

  const handleDeletePage = useCallback(
    async (pageId: number) => {
      if (confirm('Are you sure you want to delete this page?')) {
        try {
          await deletePage(pageId)
        } catch (err) {
          console.error('Failed to delete page:', err)
          alert('Failed to delete page')
        }
      }
    },
    [deletePage]
  )

  const handlePublishPage = useCallback(
    async (pageId: number) => {
      try {
        await publishPage(pageId)
      } catch (err) {
        console.error('Failed to publish page:', err)
        alert('Failed to publish page')
      }
    },
    [publishPage]
  )

  const handleUnpublishPage = useCallback(
    async (pageId: number) => {
      try {
        await unpublishPage(pageId)
      } catch (err) {
        console.error('Failed to unpublish page:', err)
        alert('Failed to unpublish page')
      }
    },
    [unpublishPage]
  )

  const handleDuplicatePage = useCallback(
    async (pageId: number) => {
      try {
        await duplicatePage(pageId)
      } catch (err) {
        console.error('Failed to duplicate page:', err)
        alert('Failed to duplicate page')
      }
    },
    [duplicatePage]
  )

  const handleEditPage = useCallback((page: Page) => {
    setSelectedPage(page)
    setEditModalOpen(true)
  }, [])

  const columns = useMemo<ColumnDef<PageWithAction, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <Typography color='text.primary' fontWeight='medium'>
            {row.original.title}
          </Typography>
        )
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            /{row.original.slug}
          </Typography>
        )
      }),
      columnHelper.accessor('template', {
        header: 'Template',
        cell: ({ row }) => (
          <Chip label={row.original.template} size='small' variant='tonal' color='primary' />
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            size='small'
            variant='tonal'
            color={pageStatusColors[row.original.status]}
          />
        )
      }),
      columnHelper.accessor('is_active', {
        header: 'Active',
        cell: ({ row }) => (
          <Chip
            label={row.original.is_active ? 'Active' : 'Inactive'}
            size='small'
            variant='tonal'
            color={row.original.is_active ? 'success' : 'error'}
          />
        )
      }),
      columnHelper.accessor('order', {
        header: 'Order',
        cell: ({ row }) => <Typography variant='body2'>{row.original.order}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleEditPage(row.original)}>
              <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
            {row.original.status !== 'published' ? (
              <IconButton size='small' onClick={() => handlePublishPage(row.original.id)}>
                <i className='ri-checkbox-circle-line text-success' />
              </IconButton>
            ) : (
              <IconButton size='small' onClick={() => handleUnpublishPage(row.original.id)}>
                <i className='ri-close-circle-line text-warning' />
              </IconButton>
            )}
            <IconButton size='small' onClick={() => handleDuplicatePage(row.original.id)}>
              <i className='ri-file-copy-line text-info' />
            </IconButton>
            <IconButton size='small' onClick={() => handleDeletePage(row.original.id)}>
              <i className='ri-delete-bin-7-line text-error' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [handleEditPage, handleDeletePage, handlePublishPage, handleUnpublishPage, handleDuplicatePage]
  )

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            size='small'
            placeholder='Search pages...'
            value={params.search || ''}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <TextField
            select
            size='small'
            label='Status'
            value={params.status || ''}
            onChange={e => updateParams({ status: e.target.value as PageStatus | undefined })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='draft'>Draft</MenuItem>
            <MenuItem value='published'>Published</MenuItem>
            <MenuItem value='archived'>Archived</MenuItem>
          </TextField>
          <TextField
            select
            size='small'
            label='Active'
            value={params.is_active === undefined ? '' : params.is_active.toString()}
            onChange={e =>
              updateParams({
                is_active: e.target.value === '' ? undefined : e.target.value === 'true'
              })
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='true'>Active</MenuItem>
            <MenuItem value='false'>Inactive</MenuItem>
          </TextField>
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setAddModalOpen(true)}>
            Add Page
          </Button>
          <Button variant='outlined' color='secondary' onClick={refresh}>
            Refresh
          </Button>
        </Box>

        <DataTable
          columns={columns}
          data={pages || []}
          loading={loading}
          pagination={{
            page: pagination.current_page - 1,
            pageSize: pagination.per_page,
            pageCount: pagination.last_page,
            total: pagination.total,
            onPageChange: page => setPage(page + 1),
            onPageSizeChange: setPageSize
          }}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          availableColumns={AVAILABLE_COLUMNS}
          storageKey={STORAGE_KEY}
          mobileCard={{
            renderCard: page => (
              <StandardMobileCard
                title={page.title}
                subtitle={`/${page.slug}`}
                status={{
                  label: page.status,
                  color: pageStatusColors[page.status]
                }}
                fields={[
                  {
                    icon: 'tabler-template',
                    label: 'Template',
                    value: <Chip label={page.template} size='small' variant='tonal' color='primary' />
                  },
                  {
                    icon: 'tabler-circle-check',
                    label: 'Active',
                    value: (
                      <Chip
                        label={page.is_active ? 'Active' : 'Inactive'}
                        size='small'
                        variant='tonal'
                        color={page.is_active ? 'success' : 'error'}
                      />
                    )
                  },
                  {
                    icon: 'tabler-calendar',
                    label: 'Created',
                    value: page.created_at ? new Date(page.created_at).toLocaleDateString() : '-'
                  }
                ]}
                actions={[
                  {
                    icon: 'ri-edit-box-line',
                    color: 'default',
                    onClick: () => handleEditPage(page)
                  },
                  {
                    icon: page.status !== 'published' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line',
                    color: page.status !== 'published' ? 'success' : 'warning',
                    onClick: () =>
                      page.status !== 'published' ? handlePublishPage(page.id) : handleUnpublishPage(page.id)
                  },
                  {
                    icon: 'ri-file-copy-line',
                    color: 'info',
                    onClick: () => handleDuplicatePage(page.id)
                  },
                  {
                    icon: 'ri-delete-bin-7-line',
                    color: 'error',
                    onClick: () => handleDeletePage(page.id)
                  }
                ]}
              />
            )
          }}
        />
      </CardContent>

      {/* Add Modal */}
      <PageAddModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={refresh} />

      {/* Edit Modal */}
      <PageEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedPage(null)
        }}
        onSuccess={refresh}
        page={selectedPage}
      />
    </Card>
  )
}

export default PagesListTable
