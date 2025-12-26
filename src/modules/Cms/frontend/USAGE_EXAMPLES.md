# Exemples d'Utilisation - CMS Frontend

Ce document fournit des exemples pratiques d'utilisation du module CMS Frontend.

## Table des matières

1. [Pages CMS](#pages-cms)
2. [Blocs CMS](#blocs-cms)
3. [Menus CMS](#menus-cms)
4. [Paramètres CMS](#paramètres-cms)
5. [Layouts personnalisés](#layouts-personnalisés)
6. [Exemples avancés](#exemples-avancés)

---

## Pages CMS

### 1. Afficher une page par slug (Server Component)

```tsx
// app/[lang]/(blank-layout-pages)/about/page.tsx
import { getPageBySlug } from '@/modules/Cms/frontend'
import { PageTemplate } from '@/modules/Cms/frontend'
import { notFound } from 'next/navigation'

export default async function AboutPage() {
  let page

  try {
    page = await getPageBySlug('about')
  } catch (error) {
    notFound()
  }

  return <PageTemplate page={page} />
}
```

### 2. Page d'accueil CMS

```tsx
// app/[lang]/page.tsx
import { getHomePage } from '@/modules/Cms/frontend'
import { PageTemplate } from '@/modules/Cms/frontend'

export default async function HomePage() {
  const page = await getHomePage()

  return <PageTemplate page={page} />
}
```

### 3. Liste de pages (Client Component)

```tsx
'use client'

import { usePages } from '@/modules/Cms/frontend'
import { Card, CardContent, Typography, Grid } from '@mui/material'
import Link from 'next/link'

export default function PagesList() {
  const { pages, loading, error } = usePages({ per_page: 10 })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading pages</div>

  return (
    <Grid container spacing={3}>
      {pages?.data.map(page => (
        <Grid item xs={12} md={4} key={page.id}>
          <Card>
            <CardContent>
              <Typography variant='h5' component={Link} href={`/cms/${page.slug}`}>
                {page.title}
              </Typography>
              {page.excerpt && (
                <Typography variant='body2' color='text.secondary'>
                  {page.excerpt}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
```

### 4. Navigation entre pages (arbre)

```tsx
'use client'

import { usePagesTree } from '@/modules/Cms/frontend'
import { TreeView, TreeItem } from '@mui/lab'
import Link from 'next/link'

export default function PagesTreeNav() {
  const { tree, loading } = usePagesTree()

  if (loading) return <div>Loading...</div>

  const renderTree = (pages: any[]) => {
    return pages.map(page => (
      <TreeItem key={page.id} nodeId={String(page.id)} label={
        <Link href={`/cms/${page.slug}`}>{page.title}</Link>
      }>
        {page.children && page.children.length > 0 && renderTree(page.children)}
      </TreeItem>
    ))
  }

  return <TreeView>{renderTree(tree)}</TreeView>
}
```

---

## Blocs CMS

### 1. Afficher un bloc spécifique

```tsx
'use client'

import { useBlock, BlockRenderer } from '@/modules/Cms/frontend'

export default function HeroSection() {
  const { block, loading } = useBlock('hero-home')

  if (loading) return <div>Loading...</div>
  if (!block) return null

  return <BlockRenderer block={block} />
}
```

### 2. Afficher plusieurs blocs

```tsx
'use client'

import { useMultipleBlocks, BlockRenderer } from '@/modules/Cms/frontend'

export default function LandingPage() {
  const { blocks, loading } = useMultipleBlocks([
    'hero-home',
    'features-main',
    'testimonials-home',
    'cta-footer'
  ])

  if (loading) return <div>Loading...</div>

  return (
    <>
      {blocks['hero-home'] && <BlockRenderer block={blocks['hero-home']} />}
      {blocks['features-main'] && <BlockRenderer block={blocks['features-main']} />}
      {blocks['testimonials-home'] && <BlockRenderer block={blocks['testimonials-home']} />}
      {blocks['cta-footer'] && <BlockRenderer block={blocks['cta-footer']} />}
    </>
  )
}
```

### 3. Filtrer les blocs par type

```tsx
'use client'

import { useBlocks, BlockRenderer } from '@/modules/Cms/frontend'

export default function FeaturesPage() {
  const { blocks, loading } = useBlocks({ type: 'features' })

  if (loading) return <div>Loading...</div>

  return (
    <>
      {blocks?.data.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  )
}
```

### 4. Utiliser un bloc spécifique directement

```tsx
'use client'

import { useBlock } from '@/modules/Cms/frontend'
import { HeroBlock } from '@/modules/Cms/frontend'

export default function CustomHero() {
  const { block } = useBlock('hero-custom')

  if (!block) return null

  return <HeroBlock block={block} />
}
```

---

## Menus CMS

### 1. Menu header

```tsx
'use client'

import { useMenuByLocation, CmsMenu } from '@/modules/Cms/frontend'

export default function HeaderNav() {
  const { menu } = useMenuByLocation('header')

  if (!menu || !menu.items) return null

  return <CmsMenu items={menu.items} orientation='horizontal' />
}
```

### 2. Menu sidebar

```tsx
'use client'

import { useMenu, CmsMenu } from '@/modules/Cms/frontend'

export default function Sidebar() {
  const { menu } = useMenu('main-sidebar')

  if (!menu || !menu.items) return null

  return <CmsMenu items={menu.items} orientation='vertical' />
}
```

### 3. Menu footer

```tsx
'use client'

import { useMenuByLocation } from '@/modules/Cms/frontend'
import { Grid, Typography, Link as MuiLink } from '@mui/material'
import Link from 'next/link'

export default function FooterNav() {
  const { menu } = useMenuByLocation('footer')

  if (!menu || !menu.items) return null

  return (
    <Grid container spacing={2}>
      {menu.items.map(item => (
        <Grid item key={item.id}>
          <MuiLink component={Link} href={item.url || '#'} color='inherit'>
            {item.title}
          </MuiLink>
        </Grid>
      ))}
    </Grid>
  )
}
```

---

## Paramètres CMS

### 1. Afficher les paramètres du site

```tsx
'use client'

import { useSettings } from '@/modules/Cms/frontend'
import { Typography } from '@mui/material'

export default function SiteInfo() {
  const { settings } = useSettings()

  return (
    <>
      <Typography variant='h1'>{settings.site_name}</Typography>
      <Typography>{settings.site_description}</Typography>
    </>
  )
}
```

### 2. Utiliser un paramètre spécifique

```tsx
'use client'

import { useSetting } from '@/modules/Cms/frontend'

export default function MaintenanceBanner() {
  const { setting: maintenanceMode } = useSetting('maintenance_mode')

  if (!maintenanceMode) return null

  return (
    <div className='maintenance-banner'>
      Site en maintenance
    </div>
  )
}
```

### 3. Charger plusieurs paramètres

```tsx
'use client'

import { useMultipleSettings } from '@/modules/Cms/frontend'

export default function ContactInfo() {
  const { settings } = useMultipleSettings([
    'contact_email',
    'contact_phone',
    'contact_address'
  ])

  return (
    <div>
      <p>Email: {settings.contact_email}</p>
      <p>Phone: {settings.contact_phone}</p>
      <p>Address: {settings.contact_address}</p>
    </div>
  )
}
```

---

## Layouts personnalisés

### 1. Layout avec header et footer CMS

```tsx
// app/[lang]/layout.tsx
import { getMenuByLocation, getPublicSettings } from '@/modules/Cms/frontend/services'
import { CmsHeader, CmsFooter } from '@/modules/Cms/frontend'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerMenu = await getMenuByLocation('header')
  const footerMenu = await getMenuByLocation('footer')
  const settings = await getPublicSettings()

  return (
    <html>
      <body>
        <CmsHeader
          menu={headerMenu}
          siteName={settings.site_name}
          logo={settings.site_logo}
        />
        <main>{children}</main>
        <CmsFooter
          menu={footerMenu}
          siteName={settings.site_name}
          siteDescription={settings.site_description}
        />
      </body>
    </html>
  )
}
```

### 2. Layout avec sidebar CMS

```tsx
'use client'

import { useMenu, CmsMenu } from '@/modules/Cms/frontend'
import { Grid } from '@mui/material'

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { menu } = useMenu('sidebar-menu')

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        {menu && menu.items && <CmsMenu items={menu.items} />}
      </Grid>
      <Grid item xs={12} md={9}>
        {children}
      </Grid>
    </Grid>
  )
}
```

---

## Exemples avancés

### 1. Page dynamique avec SEO depuis CMS

```tsx
// app/[lang]/(blank-layout-pages)/cms/[slug]/page.tsx
import { getPageBySlug } from '@/modules/Cms/frontend'
import { PageTemplate } from '@/modules/Cms/frontend'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.excerpt,
    keywords: page.meta_keywords,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || page.excerpt,
      images: page.featured_image ? [page.featured_image] : []
    }
  }
}

export default async function CmsPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)

  return <PageTemplate page={page} />
}
```

### 2. Composant de breadcrumb avec pages CMS

```tsx
'use client'

import { usePage } from '@/modules/Cms/frontend'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import NextLink from 'next/link'

export default function CmsBreadcrumb({ slug }: { slug: string }) {
  const { page } = usePage(slug)

  if (!page) return null

  const buildBreadcrumbs = () => {
    const crumbs = [{ title: 'Home', url: '/' }]

    if (page.parent) {
      crumbs.push({ title: page.parent.title, url: `/cms/${page.parent.slug}` })
    }

    crumbs.push({ title: page.title, url: `/cms/${page.slug}` })

    return crumbs
  }

  const crumbs = buildBreadcrumbs()

  return (
    <Breadcrumbs>
      {crumbs.map((crumb, index) =>
        index === crumbs.length - 1 ? (
          <Typography key={index} color='text.primary'>
            {crumb.title}
          </Typography>
        ) : (
          <Link key={index} component={NextLink} href={crumb.url}>
            {crumb.title}
          </Link>
        )
      )}
    </Breadcrumbs>
  )
}
```

### 3. Recherche de pages CMS

```tsx
'use client'

import { useState } from 'react'
import { getPages } from '@/modules/Cms/frontend/services/pageService'
import { TextField, List, ListItem, ListItemText } from '@mui/material'
import Link from 'next/link'

export default function PageSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)

    if (searchQuery.length > 2) {
      try {
        const response = await getPages({ search: searchQuery })
        setResults(response.data)
      } catch (error) {
        console.error('Search error:', error)
      }
    } else {
      setResults([])
    }
  }

  return (
    <>
      <TextField
        fullWidth
        placeholder='Search pages...'
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {results.length > 0 && (
        <List>
          {results.map(page => (
            <ListItem key={page.id} component={Link} href={`/cms/${page.slug}`}>
              <ListItemText
                primary={page.title}
                secondary={page.excerpt}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}
```

### 4. Widget "Pages récentes"

```tsx
'use client'

import { usePages } from '@/modules/Cms/frontend'
import { Card, CardContent, Typography, List, ListItem } from '@mui/material'
import Link from 'next/link'

export default function RecentPages() {
  const { pages } = usePages({ per_page: 5 })

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Recent Pages
        </Typography>
        <List>
          {pages?.data.map(page => (
            <ListItem key={page.id} component={Link} href={`/cms/${page.slug}`}>
              <Typography>{page.title}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
```

---

## Notes importantes

1. **Server vs Client Components**
   - Utilisez les services directement dans les Server Components
   - Utilisez les hooks dans les Client Components

2. **Gestion des erreurs**
   - Toujours gérer les erreurs avec try/catch
   - Utiliser `notFound()` pour les pages non trouvées
   - Afficher des messages d'erreur appropriés

3. **Performance**
   - Les services utilisent `cache: 'no-store'` par défaut
   - Considérez l'utilisation de `revalidate` pour le caching
   - Lazy load les composants lourds

4. **SEO**
   - Utilisez `generateMetadata` pour le SEO
   - Exploitez les champs `meta_title`, `meta_description`, `meta_keywords`
   - Ajoutez des données structurées si nécessaire
