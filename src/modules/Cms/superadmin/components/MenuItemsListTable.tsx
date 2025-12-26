'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'

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

import type {
  MenuItem as MenuItemType,
  MenuItemTarget,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  Menu
} from '../../types'

import { DataTable, StandardMobileCard } from '@/components/shared/DataTable'
import type { ColumnConfig } from '@/components/shared/DataTable'

import { useMenuItemsContext } from './MenuItemsList'
import { menuService } from '../services/menuService'
import { pageService } from '../services/pageService'

type MenuItemWithAction = MenuItemType & { action?: string }

const MENU_ITEM_TARGETS: MenuItemTarget[] = ['_self', '_blank', '_parent', '_top']

const AVAILABLE_COLUMNS: ColumnConfig[] = [
  { id: 'title', label: 'Title', defaultVisible: true },
  { id: 'url', label: 'URL', defaultVisible: true },
  { id: 'menu_id', label: 'Menu', defaultVisible: true },
  { id: 'target', label: 'Target', defaultVisible: false },
  { id: 'is_active', label: 'Active', defaultVisible: true },
  { id: 'order', label: 'Order', defaultVisible: true }
]

const STORAGE_KEY = 'menuItemsListTableColumns'
const columnHelper = createColumnHelper<MenuItemWithAction>()

const MenuItemsListTable = () => {
  const { tenantId } = useTenant()
  const {
    menuItems,
    loading,
    pagination,
    params,
    setPage,
    setPageSize,
    updateParams,
    refresh,
    deleteMenuItem,
    createMenuItem,
    updateMenuItem
  } = useMenuItemsContext()

  const [mounted, setMounted] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [menus, setMenus] = useState<Menu[]>([])
  const [menusLoading, setMenusLoading] = useState(false)

  const [pages, setPages] = useState<import('../../types').Page[]>([])
  const [pagesLoading, setPagesLoading] = useState(false)

  const [formData, setFormData] = useState<CreateMenuItemPayload | UpdateMenuItemPayload>({
    menu_id: 0,
    parent_id: null,
    title: '',
    url: '',
    route: '',
    route_params: null,
    page_id: null,
    target: '_self',
    icon: '',
    css_class: '',
    order: 0,
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchMenus = async () => {
      setMenusLoading(true)
      try {
        const response = await menuService.getMenus(tenantId, { per_page: 100 })

        setMenus(response.data)
      } catch (err) {
        console.error('Error fetching menus:', err)
      } finally {
        setMenusLoading(false)
      }
    }

    fetchMenus()
  }, [tenantId])

  useEffect(() => {
    const fetchPages = async () => {
      setPagesLoading(true)
      try {
        const response = await pageService.getPages(tenantId, { per_page: 1000 })

        setPages(response.data)
      } catch (err) {
        console.error('Error fetching pages:', err)
      } finally {
        setPagesLoading(false)
      }
    }

    fetchPages()
  }, [tenantId])

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setColumnVisibility(prev => {
      const newVisibility = { ...prev, [columnId]: visible }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility))

      return newVisibility
    })
  }

  const handleDeleteMenuItem = useCallback(
    async (itemId: number) => {
      if (confirm('Are you sure you want to delete this menu item?')) {
        try {
          await deleteMenuItem(itemId)
        } catch (err) {
          console.error('Failed to delete menu item:', err)
          alert('Failed to delete menu item')
        }
      }
    },
    [deleteMenuItem]
  )

  const handleEditMenuItem = useCallback((item: MenuItemType) => {
    setSelectedMenuItem(item)
    setFormData({
      menu_id: item.menu_id,
      parent_id: item.parent_id || null,
      title: item.title,
      url: item.url || '',
      route: item.route || '',
      route_params: item.route_params || null,
      page_id: item.page_id || null,
      target: item.target,
      icon: item.icon || '',
      css_class: item.css_class || '',
      order: item.order,
      is_active: item.is_active
    })
    setEditModalOpen(true)
  }, [])

  const handleOpenAddModal = () => {
    setFormData({
      menu_id: menus.length > 0 ? menus[0].id : 0,
      parent_id: null,
      title: '',
      url: '',
      route: '',
      route_params: null,
      page_id: null,
      target: '_self',
      icon: '',
      css_class: '',
      order: 0,
      is_active: true
    })
    setAddModalOpen(true)
  }

  const handleCloseModals = () => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setSelectedMenuItem(null)
    setError(null)
  }

  const handleSubmitAdd = async () => {
    try {
      setModalLoading(true)
      setError(null)
      await createMenuItem(formData as CreateMenuItemPayload)
      refresh()
      handleCloseModals()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create menu item')
    } finally {
      setModalLoading(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedMenuItem) return

    try {
      setModalLoading(true)
      setError(null)
      await updateMenuItem(selectedMenuItem.id, formData as UpdateMenuItemPayload)
      refresh()
      handleCloseModals()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update menu item')
    } finally {
      setModalLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<MenuItemWithAction, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <Typography color='text.primary' fontWeight='medium'>
            {row.original.title}
          </Typography>
        )
      }),
      columnHelper.accessor('url', {
        header: 'URL',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary' fontFamily='monospace'>
            {row.original.url || row.original.route || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('menu_id', {
        header: 'Menu',
        cell: ({ row }) => {
          const menu = menus.find(m => m.id === row.original.menu_id)

          return <Chip label={menu?.name || `#${row.original.menu_id}`} size='small' variant='tonal' />
        }
      }),
      columnHelper.accessor('target', {
        header: 'Target',
        cell: ({ row }) => <Chip label={row.original.target} size='small' />
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
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleEditMenuItem(row.original)}>
              <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleDeleteMenuItem(row.original.id)}>
              <i className='ri-delete-bin-7-line text-error' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [handleEditMenuItem, handleDeleteMenuItem, menus]
  )

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <TextField
            select
            size='small'
            label='Filter by Menu'
            value={params.menu_id || ''}
            onChange={e => updateParams({ menu_id: e.target.value ? parseInt(e.target.value) : undefined })}
            sx={{ minWidth: 200 }}
            disabled={menusLoading}
          >
            <MenuItem value=''>All Menus</MenuItem>
            {menus.map(menu => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleOpenAddModal}>
              Add Menu Item
            </Button>
            <Button variant='outlined' color='secondary' onClick={refresh}>
              Refresh
            </Button>
          </Box>
        </Box>

        <DataTable
          columns={columns}
          data={menuItems || []}
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
            renderCard: item => (
              <StandardMobileCard
                title={item.title}
                subtitle={item.url || item.route || '-'}
                status={{ label: item.is_active ? 'Active' : 'Inactive', color: item.is_active ? 'success' : 'error' }}
                fields={[
                  { icon: 'ri-menu-line', label: 'Menu', value: `#${item.menu_id}` },
                  { icon: 'ri-sort-asc', label: 'Order', value: item.order.toString() }
                ]}
                actions={[
                  { icon: 'ri-edit-box-line', color: 'default', onClick: () => handleEditMenuItem(item) },
                  { icon: 'ri-delete-bin-7-line', color: 'error', onClick: () => handleDeleteMenuItem(item.id) }
                ]}
              />
            )
          }}
        />
      </CardContent>

      {/* Add/Edit Modal */}
      {mounted && (
        <Dialog open={addModalOpen || editModalOpen} onClose={handleCloseModals} maxWidth='md' fullWidth>
        <DialogTitle>{selectedMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <Divider />
        <DialogContent>
          {error && (
            <Alert severity='error' onClose={() => setError(null)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Menu</InputLabel>
                <Select
                  value={formData.menu_id || ''}
                  label='Menu'
                  onChange={e => setFormData(prev => ({ ...prev, menu_id: Number(e.target.value) }))}
                  disabled={menusLoading}
                >
                  {menus.map(menu => (
                    <MenuItem key={menu.id} value={menu.id}>
                      {menu.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label='Title'
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='URL'
                value={formData.url}
                onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                helperText='Direct URL link'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Route'
                value={formData.route}
                onChange={e => setFormData(prev => ({ ...prev, route: e.target.value }))}
                helperText='Laravel route name'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Page (Optional)</InputLabel>
                <Select
                  value={formData.page_id || ''}
                  label='Page (Optional)'
                  onChange={e => setFormData(prev => ({ ...prev, page_id: e.target.value ? Number(e.target.value) : null }))}
                  disabled={pagesLoading}
                >
                  <MenuItem value=''>None</MenuItem>
                  {pages.map(page => (
                    <MenuItem key={page.id} value={page.id}>
                      {page.title} ({page.slug})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Target</InputLabel>
                <Select
                  value={formData.target}
                  label='Target'
                  onChange={e => setFormData(prev => ({ ...prev, target: e.target.value as MenuItemTarget }))}
                >
                  {MENU_ITEM_TARGETS.map(target => (
                    <MenuItem key={target} value={target}>
                      {target}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Icon'
                value={formData.icon}
                onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                helperText='Icon class (e.g., ri-home-line)'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='CSS Class'
                value={formData.css_class}
                onChange={e => setFormData(prev => ({ ...prev, css_class: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type='number'
                label='Order'
                value={formData.order}
                onChange={e => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Parent Item (Optional)</InputLabel>
                <Select
                  value={formData.parent_id || ''}
                  label='Parent Item (Optional)'
                  onChange={e => setFormData(prev => ({ ...prev, parent_id: e.target.value ? Number(e.target.value) : null }))}
                >
                  <MenuItem value=''>None</MenuItem>
                  {menuItems
                    .filter(item => item.id !== selectedMenuItem?.id)
                    .filter(item => formData.menu_id ? item.menu_id === formData.menu_id : true)
                    .map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
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
            onClick={selectedMenuItem ? handleSubmitEdit : handleSubmitAdd}
            variant='contained'
            disabled={!formData.title || !formData.menu_id || modalLoading}
          >
            {modalLoading ? <CircularProgress size={20} /> : selectedMenuItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </Card>
  )
}

export default MenuItemsListTable
