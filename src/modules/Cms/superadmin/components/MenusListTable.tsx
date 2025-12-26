'use client'

import { useState, useMemo, useCallback } from 'react'

import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid2'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import { useTenant } from '@/shared/lib/tenant-context'

import type { Menu, MenuLocation, CreateMenuPayload, UpdateMenuPayload } from '../../types'

import { DataTable, StandardMobileCard } from '@/components/shared/DataTable'
import type { ColumnConfig } from '@/components/shared/DataTable'

import { useMenusContext } from './MenusList'
import { menuService } from '../services/menuService'

type MenuWithAction = Menu & { action?: string }

const MENU_LOCATIONS: MenuLocation[] = ['header', 'footer', 'sidebar', 'mobile']

const AVAILABLE_COLUMNS: ColumnConfig[] = [
  { id: 'name', label: 'Name', defaultVisible: true },
  { id: 'identifier', label: 'Identifier', defaultVisible: true },
  { id: 'location', label: 'Location', defaultVisible: true },
  { id: 'is_active', label: 'Active', defaultVisible: true },
  { id: 'created_at', label: 'Created At', defaultVisible: true }
]

const STORAGE_KEY = 'menusListTableColumns'
const columnHelper = createColumnHelper<MenuWithAction>()

const MenusListTable = () => {
  const { tenantId } = useTenant()
  const { menus, loading, pagination, setPage, setPageSize, refresh, deleteMenu } = useMenusContext()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateMenuPayload | UpdateMenuPayload>({
    name: '',
    identifier: '',
    description: '',
    location: 'header',
    is_active: true
  })

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

    return AVAILABLE_COLUMNS.reduce((acc, col) => {
      acc[col.id] = col.defaultVisible

      return acc
    }, {} as Record<string, boolean>)
  })

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setColumnVisibility(prev => {
      const newVisibility = { ...prev, [columnId]: visible }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility))

      return newVisibility
    })
  }

  const handleDeleteMenu = useCallback(
    async (menuId: number) => {
      if (confirm('Are you sure you want to delete this menu?')) {
        try {
          await deleteMenu(menuId)
        } catch (err) {
          console.error('Failed to delete menu:', err)
          alert('Failed to delete menu')
        }
      }
    },
    [deleteMenu]
  )

  const handleEditMenu = useCallback((menu: Menu) => {
    setSelectedMenu(menu)
    setFormData({
      name: menu.name,
      identifier: menu.identifier,
      description: menu.description || '',
      location: menu.location,
      is_active: menu.is_active
    })
    setEditModalOpen(true)
  }, [])

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      identifier: '',
      description: '',
      location: 'header',
      is_active: true
    })
    setAddModalOpen(true)
  }

  const handleCloseModals = () => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setSelectedMenu(null)
    setError(null)
  }

  const handleSubmitAdd = async () => {
    try {
      setModalLoading(true)
      setError(null)
      await menuService.createMenu(formData as CreateMenuPayload, tenantId)
      refresh()
      handleCloseModals()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create menu')
    } finally {
      setModalLoading(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedMenu) return

    try {
      setModalLoading(true)
      setError(null)
      await menuService.updateMenu(selectedMenu.id, formData as UpdateMenuPayload, tenantId)
      refresh()
      handleCloseModals()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update menu')
    } finally {
      setModalLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<MenuWithAction, any>[]>(
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
      columnHelper.accessor('location', {
        header: 'Location',
        cell: ({ row }) => <Chip label={row.original.location} size='small' variant='tonal' color='primary' />
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
            <IconButton size='small' onClick={() => handleEditMenu(row.original)}>
              <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleDeleteMenu(row.original.id)}>
              <i className='ri-delete-bin-7-line text-error' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [handleEditMenu, handleDeleteMenu]
  )

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddModal}>
            Add Menu
          </Button>
          <Button variant='outlined' color='secondary' onClick={refresh}>
            Refresh
          </Button>
        </Box>

        <DataTable
          columns={columns}
          data={menus || []}
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
            renderCard: menu => (
              <StandardMobileCard
                title={menu.name}
                subtitle={menu.identifier}
                status={{ label: menu.is_active ? 'Active' : 'Inactive', color: menu.is_active ? 'success' : 'error' }}
                fields={[
                  { icon: 'ri-map-pin-line', label: 'Location', value: <Chip label={menu.location} size='small' /> }
                ]}
                actions={[
                  { icon: 'ri-edit-box-line', color: 'default', onClick: () => handleEditMenu(menu) },
                  { icon: 'ri-delete-bin-7-line', color: 'error', onClick: () => handleDeleteMenu(menu.id) }
                ]}
              />
            )
          }}
        />
      </CardContent>

      {/* Add/Edit Modal */}
      <Dialog open={addModalOpen || editModalOpen} onClose={handleCloseModals} maxWidth='sm' fullWidth>
        <DialogTitle>{selectedMenu ? 'Edit Menu' : 'Add New Menu'}</DialogTitle>
        <Divider />
        <DialogContent>
          {error && (
            <Alert severity='error' onClose={() => setError(null)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label='Name'
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label='Identifier'
                value={formData.identifier}
                onChange={e => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Description'
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  label='Location'
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value as MenuLocation }))}
                >
                  {MENU_LOCATIONS.map(loc => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label='Active'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseModals} disabled={modalLoading}>
            Cancel
          </Button>
          <Button
            onClick={selectedMenu ? handleSubmitEdit : handleSubmitAdd}
            variant='contained'
            disabled={!formData.name || !formData.identifier || modalLoading}
          >
            {modalLoading ? <CircularProgress size={20} /> : selectedMenu ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default MenusListTable
