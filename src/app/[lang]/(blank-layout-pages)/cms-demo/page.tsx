/**
 * CMS Demo Page
 * Demonstrates all CMS frontend features
 */

'use client'

import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material'
import { useState } from 'react'

import { usePages, useBlocks, useMenuByLocation, useSettings } from '@/modules/Cms/frontend'
import { BlockRenderer, CmsMenu } from '@/modules/Cms/frontend'

function TabPanel({ children, value, index }: any) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function CmsDemoPage() {
  const [tabValue, setTabValue] = useState(0)

  const { pages, loading: pagesLoading } = usePages({ per_page: 5 })
  const { blocks, loading: blocksLoading } = useBlocks({ per_page: 5 })
  const { menu: headerMenu, loading: menuLoading } = useMenuByLocation('header')
  const { settings, loading: settingsLoading } = useSettings()

  return (
    <Container maxWidth='lg' sx={{ py: 8 }}>
      <Typography variant='h2' component='h1' gutterBottom fontWeight='bold' textAlign='center'>
        CMS Frontend Demo
      </Typography>

      <Typography variant='h6' textAlign='center' color='text.secondary' sx={{ mb: 6 }}>
        Démonstration de toutes les fonctionnalités du module CMS Frontend
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant='scrollable'>
          <Tab label='Pages' />
          <Tab label='Blocs' />
          <Tab label='Menus' />
          <Tab label='Paramètres' />
        </Tabs>

        {/* Tab: Pages */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant='h5' gutterBottom>
            Pages CMS
          </Typography>
          {pagesLoading ? (
            <Typography>Chargement des pages...</Typography>
          ) : pages?.data && pages.data.length > 0 ? (
            <Box>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {pages.meta.total} page(s) trouvée(s)
              </Typography>
              {pages.data.map(page => (
                <Paper key={page.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant='h6'>{page.title}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Slug: {page.slug} | Template: {page.template} | Statut: {page.status}
                  </Typography>
                  {page.excerpt && (
                    <Typography variant='body2' sx={{ mt: 1 }}>
                      {page.excerpt}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color='text.secondary'>
              Aucune page trouvée. Assurez-vous que l'API est configurée et que des pages sont publiées.
            </Typography>
          )}
        </TabPanel>

        {/* Tab: Blocs */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant='h5' gutterBottom>
            Blocs CMS
          </Typography>
          {blocksLoading ? (
            <Typography>Chargement des blocs...</Typography>
          ) : blocks?.data && blocks.data.length > 0 ? (
            <Box>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {blocks.meta.total} bloc(s) trouvé(s)
              </Typography>
              {blocks.data.map(block => (
                <Paper key={block.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant='h6'>{block.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Identifiant: {block.identifier} | Type: {block.type}
                  </Typography>
                  <Box sx={{ mt: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                    <BlockRenderer block={block} />
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color='text.secondary'>
              Aucun bloc trouvé. Assurez-vous que l'API est configurée et que des blocs sont actifs.
            </Typography>
          )}
        </TabPanel>

        {/* Tab: Menus */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant='h5' gutterBottom>
            Menus CMS
          </Typography>
          {menuLoading ? (
            <Typography>Chargement du menu...</Typography>
          ) : headerMenu && headerMenu.items ? (
            <Box>
              <Typography variant='h6' gutterBottom>
                Menu Header
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {headerMenu.items.length} élément(s) dans le menu
              </Typography>
              <Paper sx={{ p: 2 }}>
                <CmsMenu items={headerMenu.items} orientation='vertical' />
              </Paper>
            </Box>
          ) : (
            <Typography color='text.secondary'>
              Aucun menu trouvé. Créez un menu avec l'emplacement "header" dans le CMS Admin.
            </Typography>
          )}
        </TabPanel>

        {/* Tab: Paramètres */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant='h5' gutterBottom>
            Paramètres CMS
          </Typography>
          {settingsLoading ? (
            <Typography>Chargement des paramètres...</Typography>
          ) : settings && Object.keys(settings).length > 0 ? (
            <Box>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {Object.keys(settings).length} paramètre(s) public(s) trouvé(s)
              </Typography>
              <Paper sx={{ p: 2 }}>
                {Object.entries(settings).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      {key}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Box>
          ) : (
            <Typography color='text.secondary'>
              Aucun paramètre public trouvé. Créez des paramètres avec "is_public: true" dans le CMS Admin.
            </Typography>
          )}
        </TabPanel>
      </Paper>

      <Paper sx={{ p: 3, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant='h6' gutterBottom>
          🎉 Le module CMS Frontend est opérationnel !
        </Typography>
        <Typography variant='body2'>
          Si vous voyez des données ci-dessus, le module fonctionne correctement. Si ce n'est pas le cas, vérifiez :
        </Typography>
        <Box component='ul' sx={{ mt: 1 }}>
          <li>L'URL de l'API dans .env (NEXT_PUBLIC_API_URL)</li>
          <li>Que l'API backend est accessible et fonctionne</li>
          <li>Que des contenus sont publiés dans le CMS Admin</li>
          <li>La console du navigateur pour les erreurs</li>
        </Box>
      </Paper>
    </Container>
  )
}
