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

import type { Block, BlockType } from '../../types'

import { DataTable, StandardMobileCard } from '@/components/shared/DataTable'
import type { ColumnConfig } from '@/components/shared/DataTable'

import { useBlocksContext } from './BlocksList'
import BlockAddModal from './BlockAddModal'
import BlockEditModal from './BlockEditModal'

type BlockWithAction = Block & {
  action?: string
}

const AVAILABLE_COLUMNS: ColumnConfig[] = [
  { id: 'name', label: 'Name', defaultVisible: true },
  { id: 'identifier', label: 'Identifier', defaultVisible: true },
  { id: 'type', label: 'Type', defaultVisible: true },
  { id: 'is_active', label: 'Active', defaultVisible: true },
  { id: 'order', label: 'Order', defaultVisible: false },
  { id: 'created_at', label: 'Created At', defaultVisible: true }
]

const STORAGE_KEY = 'blocksListTableColumns'

const columnHelper = createColumnHelper<BlockWithAction>()

const BlocksListTable = () => {
  const { blocks, loading, pagination, params, setPage, setPageSize, setSearch, updateParams, refresh, deleteBlock } =
    useBlocksContext()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

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

  const handleDeleteBlock = useCallback(
    async (blockId: number) => {
      if (confirm('Are you sure you want to delete this block?')) {
        try {
          await deleteBlock(blockId)
        } catch (err) {
          console.error('Failed to delete block:', err)
          alert('Failed to delete block')
        }
      }
    },
    [deleteBlock]
  )

  const handleEditBlock = useCallback((block: Block) => {
    setSelectedBlock(block)
    setEditModalOpen(true)
  }, [])

  const columns = useMemo<ColumnDef<BlockWithAction, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography color='text.primary' fontWeight='medium'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('identifier', {
        header: 'Identifier',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary' fontFamily='monospace'>
            {row.original.identifier}
          </Typography>
        )
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ row }) => <Chip label={row.original.type} size='small' variant='tonal' color='info' />
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
            <IconButton size='small' onClick={() => handleEditBlock(row.original)}>
              <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleDeleteBlock(row.original.id)}>
              <i className='ri-delete-bin-7-line text-error' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [handleEditBlock, handleDeleteBlock]
  )

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            size='small'
            placeholder='Search blocks...'
            value={params.search || ''}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <TextField
            select
            size='small'
            label='Type'
            value={params.type || ''}
            onChange={e => updateParams({ type: e.target.value as BlockType | undefined })}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='text'>Text</MenuItem>
            <MenuItem value='html'>HTML</MenuItem>
            <MenuItem value='hero'>Hero</MenuItem>
            <MenuItem value='cta'>CTA</MenuItem>
            <MenuItem value='features'>Features</MenuItem>
            <MenuItem value='testimonials'>Testimonials</MenuItem>
            <MenuItem value='gallery'>Gallery</MenuItem>
            <MenuItem value='video'>Video</MenuItem>
            <MenuItem value='contact'>Contact</MenuItem>
            <MenuItem value='faq'>FAQ</MenuItem>
            <MenuItem value='pricing'>Pricing</MenuItem>
            <MenuItem value='team'>Team</MenuItem>
            <MenuItem value='stats'>Stats</MenuItem>
            <MenuItem value='newsletter'>Newsletter</MenuItem>
          </TextField>
          <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={() => setAddModalOpen(true)}>
            Add Block
          </Button>
          <Button variant='outlined' color='secondary' onClick={refresh}>
            Refresh
          </Button>
        </Box>

        <DataTable
          columns={columns}
          data={blocks || []}
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
            renderCard: block => (
              <StandardMobileCard
                title={block.name}
                subtitle={block.identifier}
                status={{
                  label: block.is_active ? 'Active' : 'Inactive',
                  color: block.is_active ? 'success' : 'error'
                }}
                fields={[
                  {
                    icon: 'tabler-layout',
                    label: 'Type',
                    value: <Chip label={block.type} size='small' variant='tonal' color='info' />
                  },
                  {
                    icon: 'tabler-sort-ascending',
                    label: 'Order',
                    value: block.order.toString()
                  },
                  {
                    icon: 'tabler-calendar',
                    label: 'Created',
                    value: block.created_at ? new Date(block.created_at).toLocaleDateString() : '-'
                  }
                ]}
                actions={[
                  {
                    icon: 'ri-edit-box-line',
                    color: 'default',
                    onClick: () => handleEditBlock(block)
                  },
                  {
                    icon: 'ri-delete-bin-7-line',
                    color: 'error',
                    onClick: () => handleDeleteBlock(block.id)
                  }
                ]}
              />
            )
          }}
        />
      </CardContent>

      {/* Add Modal */}
      <BlockAddModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={refresh} />

      {/* Edit Modal */}
      <BlockEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedBlock(null)
        }}
        onSuccess={refresh}
        block={selectedBlock}
      />
    </Card>
  )
}

export default BlocksListTable
