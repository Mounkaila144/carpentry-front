# Guide d'Installation - CMS Frontend

Ce guide explique comment installer et configurer le module CMS Frontend dans votre application Next.js.

## Prérequis

- Next.js 15+
- Material-UI (MUI) 6+
- TypeScript
- API CMS Backend configurée et accessible

## Étapes d'Installation

### 1. Configuration de l'environnement

Ajoutez les variables d'environnement nécessaires dans votre fichier `.env` :

```env
# URL de l'API CMS (publique - accessible côté client)
NEXT_PUBLIC_API_URL=/api

# Si votre API est sur un domaine différent :
# NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
```

### 2. Import des styles CSS

Importez les styles CMS dans votre layout principal :

```tsx
// app/layout.tsx ou app/[lang]/layout.tsx
import '@/modules/Cms/frontend/styles/cms-content.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Configuration des routes

Les routes CMS sont déjà configurées dans :

```
src/app/[lang]/(blank-layout-pages)/cms/
├── layout.tsx          # Layout avec header/footer CMS
├── page.tsx            # Page d'accueil CMS
└── [slug]/
    └── page.tsx        # Pages dynamiques CMS
```

**Accès aux routes :**
- `/en/cms` - Page d'accueil CMS
- `/en/cms/about` - Page "about"
- `/en/cms/contact` - Page "contact"
- etc.

### 4. Configuration du Layout CMS (optionnel)

Si vous souhaitez utiliser un layout personnalisé, modifiez `cms/layout.tsx` :

```tsx
// src/app/[lang]/(blank-layout-pages)/cms/layout.tsx
import { Box } from '@mui/material'
import { getMenuByLocation, getPublicSettings } from '@/modules/Cms/frontend/services'
import { CmsHeader, CmsFooter } from '@/modules/Cms/frontend'

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const headerMenu = await getMenuByLocation('header')
  const footerMenu = await getMenuByLocation('footer')
  const settings = await getPublicSettings()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CmsHeader
        menu={headerMenu}
        siteName={settings.site_name}
        logo={settings.site_logo}
      />

      <Box component='main' sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <CmsFooter
        menu={footerMenu}
        siteName={settings.site_name}
        siteDescription={settings.site_description}
        copyrightText={settings.copyright_text}
      />
    </Box>
  )
}
```

### 5. Configuration de l'API Backend

Assurez-vous que votre backend Laravel expose les endpoints suivants :

**Pages :**
- `GET /api/cms/pages` - Liste des pages publiées
- `GET /api/cms/pages/home` - Page d'accueil
- `GET /api/cms/pages/{slug}` - Page par slug
- `GET /api/cms/pages/tree` - Arbre des pages

**Blocs :**
- `GET /api/cms/blocks` - Liste des blocs actifs
- `GET /api/cms/blocks/{identifier}` - Bloc par identifiant
- `GET /api/cms/blocks/multiple?identifiers[]=x&identifiers[]=y` - Plusieurs blocs

**Menus :**
- `GET /api/cms/menus/{identifier}` - Menu par identifiant
- `GET /api/cms/menus/location/{location}` - Menu par emplacement

**Paramètres :**
- `GET /api/cms/settings` - Tous les paramètres publics
- `GET /api/cms/settings/{key}` - Paramètre par clé
- `GET /api/cms/settings/multiple` - Plusieurs paramètres

### 6. Configuration CORS (si API externe)

Si votre API est sur un domaine différent, configurez CORS dans Laravel :

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_origins' => ['http://localhost:3000', 'https://votre-domaine.com'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['*'],
];
```

## Utilisation de Base

### 1. Afficher une page CMS

```tsx
// Votre composant ou page
import { getPageBySlug } from '@/modules/Cms/frontend'
import { PageTemplate } from '@/modules/Cms/frontend'

export default async function CustomPage() {
  const page = await getPageBySlug('ma-page')

  return <PageTemplate page={page} />
}
```

### 2. Afficher des blocs CMS

```tsx
'use client'

import { useMultipleBlocks, BlockRenderer } from '@/modules/Cms/frontend'

export default function HomePage() {
  const { blocks } = useMultipleBlocks(['hero-home', 'features'])

  return (
    <>
      {blocks['hero-home'] && <BlockRenderer block={blocks['hero-home']} />}
      {blocks['features'] && <BlockRenderer block={blocks['features']} />}
    </>
  )
}
```

### 3. Afficher un menu CMS

```tsx
'use client'

import { useMenuByLocation, CmsMenu } from '@/modules/Cms/frontend'

export default function Navigation() {
  const { menu } = useMenuByLocation('header')

  return menu ? <CmsMenu items={menu.items} orientation='horizontal' /> : null
}
```

## Personnalisation

### 1. Personnaliser les styles des blocs

Modifiez le fichier CSS :

```css
/* src/modules/Cms/frontend/styles/cms-content.css */

.cms-content h1 {
  color: #your-color;
  font-size: 3rem;
}

/* Ajoutez vos styles personnalisés */
```

### 2. Créer un bloc personnalisé

```tsx
// src/modules/Cms/frontend/components/blocks/CustomBlock.tsx
'use client'

import { Box, Typography } from '@mui/material'
import type { Block } from '@/modules/Cms/types/block.types'

interface CustomBlockProps {
  block: Block
}

export default function CustomBlock({ block }: CustomBlockProps) {
  const { content, settings } = block

  return (
    <Box sx={{ py: 8, backgroundColor: settings?.bg || 'transparent' }}>
      <Typography variant='h3'>{content.title}</Typography>
      {/* Votre contenu personnalisé */}
    </Box>
  )
}
```

Puis ajoutez-le au BlockRenderer :

```tsx
// src/modules/Cms/frontend/components/blocks/BlockRenderer.tsx
import CustomBlock from './CustomBlock'

export default function BlockRenderer({ block }: BlockRendererProps) {
  // ...
  switch (block.type) {
    // ... autres cas
    case 'custom':
      return <CustomBlock block={block} />
    // ...
  }
}
```

### 3. Créer un template personnalisé

```tsx
// src/modules/Cms/frontend/components/templates/CustomTemplate.tsx
'use client'

import { Container, Typography } from '@mui/material'
import type { Page } from '@/modules/Cms/types/page.types'

interface CustomTemplateProps {
  page: Page
}

export default function CustomTemplate({ page }: CustomTemplateProps) {
  return (
    <Container>
      <Typography variant='h1'>{page.title}</Typography>
      {/* Votre layout personnalisé */}
    </Container>
  )
}
```

Puis ajoutez-le au PageTemplate :

```tsx
// src/modules/Cms/frontend/components/templates/PageTemplate.tsx
import CustomTemplate from './CustomTemplate'

export default function PageTemplate({ page }: PageTemplateProps) {
  switch (page.template) {
    // ... autres cas
    case 'custom':
      return <CustomTemplate page={page} />
    // ...
  }
}
```

## Dépannage

### Problème : Pages CMS ne s'affichent pas

**Vérifications :**
1. L'URL de l'API est correcte dans `.env`
2. Le backend est accessible
3. Les pages sont publiées (`status: 'published'`) et actives (`is_active: true`)
4. Les routes Next.js sont correctement configurées

**Console du navigateur :**
```
Failed to fetch pages
```
→ Vérifiez la connexion à l'API et les CORS

### Problème : Blocs ne s'affichent pas

**Vérifications :**
1. Les blocs sont actifs (`is_active: true`)
2. L'identifiant du bloc est correct
3. Le type de bloc est supporté dans BlockRenderer

### Problème : Menus ne s'affichent pas

**Vérifications :**
1. Le menu existe dans le CMS
2. L'identifiant ou l'emplacement est correct
3. Le menu a des éléments actifs
4. Les éléments de menu ont des URLs valides

### Problème : Styles CSS non appliqués

**Solution :**
Vérifiez que vous avez bien importé le CSS dans votre layout :

```tsx
import '@/modules/Cms/frontend/styles/cms-content.css'
```

## Performance

### Caching

Pour améliorer les performances, activez le caching Next.js :

```tsx
// Dans vos services
export async function getPageBySlug(slug: string): Promise<Page> {
  const response = await fetch(`${API_URL}/cms/pages/${slug}`, {
    next: { revalidate: 60 } // Revalider toutes les 60 secondes
  })
  // ...
}
```

### Server Components

Privilégiez les Server Components pour les pages CMS :

```tsx
// Server Component (par défaut dans Next.js 15)
export default async function CmsPage() {
  const page = await getPageBySlug('about')
  return <PageTemplate page={page} />
}
```

### Static Generation

Pour les pages statiques :

```tsx
export async function generateStaticParams() {
  const pages = await getPages()

  return pages.data.map((page) => ({
    slug: page.slug,
  }))
}
```

## Support et Documentation

- [README Frontend](./README.md) - Vue d'ensemble du module
- [Exemples d'utilisation](./USAGE_EXAMPLES.md) - Exemples pratiques
- [Documentation API](../../DOCUMENTATION_API_CMS.md) - Documentation de l'API Backend

## Prochaines étapes

1. ✅ Installation terminée
2. 📝 Créez des pages dans le CMS Admin
3. 🎨 Personnalisez les templates et blocs
4. 🚀 Déployez votre application

Bon développement ! 🎉
