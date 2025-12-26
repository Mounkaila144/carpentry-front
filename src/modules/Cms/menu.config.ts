import type { ModuleMenuConfig } from '@/shared/types/menu-config.types'

/**
 * CMS Module Menu Configuration
 *
 * This file defines all menu items for the CMS module.
 * Menus are displayed in the superadmin sidebar.
 */
export const cmsMenuConfig: ModuleMenuConfig = {
  module: 'Cms',
  menus: [
    {
      id: 'cms-superadmin',
      label: 'CMS',
      icon: {
        type: 'emoji',
        value: '📄'
      },
      order: 10,
      module: 'Cms',
      roles: ['superadmin'],
      isVisible: true,
      isActive: true,
      children: [
        {
        id: 'cms-pages',
        label: 'Pages',
        route: '/superadmin/cms/pages',
        icon: {
          type: 'emoji',
          value: '📝'
        },
          order: 1,
          module: 'Cms',
          roles: ['superadmin'],
          isVisible: true,
          isActive: true
        },
        {
          id: 'cms-blocks',
          label: 'Blocks',
          route: '/superadmin/cms/blocks',
          icon: {
            type: 'emoji',
            value: '🧩'
          },
          order: 2,
          module: 'Cms',
          roles: ['superadmin'],
          isVisible: true,
          isActive: true
        },
        {
          id: 'cms-menus',
          label: 'Menus',
          icon: {
            type: 'emoji',
            value: '🍔'
          },
          order: 3,
          module: 'Cms',
          roles: ['superadmin'],
          isVisible: true,
          isActive: true,
          children: [
            {
              id: 'cms-menus-list',
              label: 'All Menus',
              route: '/superadmin/cms/menus',
              order: 1,
              module: 'Cms',
              roles: ['superadmin'],
              isVisible: true,
              isActive: true
            },
            {
              id: 'cms-menu-items',
              label: 'Menu Items',
              route: '/superadmin/cms/menu-items',
              order: 2,
              module: 'Cms',
              roles: ['superadmin'],
              isVisible: true,
              isActive: true
            }
          ]
        },
        {
          id: 'cms-media',
          label: 'Media Library',
          route: '/superadmin/cms/media',
          icon: {
            type: 'emoji',
            value: '🖼️'
          },
          order: 4,
          module: 'Cms',
          roles: ['superadmin'],
          isVisible: true,
          isActive: true
        },
        {
          id: 'cms-settings',
          label: 'Settings',
          route: '/superadmin/cms/settings',
          icon: {
            type: 'emoji',
            value: '⚙️'
          },
          order: 5,
          module: 'Cms',
          roles: ['superadmin'],
          isVisible: true,
          isActive: true
        }
      ]
    }
  ]
}
