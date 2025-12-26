# CMS Frontend Module

Module frontend pour le système CMS. Ce module permet d'afficher les pages, blocs et menus créés via le CMS sans nécessiter d'authentification.

## Structure

```
frontend/
├── services/           # Services API pour consommer les endpoints publics
│   ├── pageService.ts
│   ├── blockService.ts
│   ├── menuService.ts
│   └── settingsService.ts
├── hooks/              # Hooks React pour faciliter l'utilisation
│   ├── usePages.ts
│   ├── useBlocks.ts
│   ├── useMenus.ts
│   └── useSettings.ts
├── components/
│   ├── blocks/         # Composants pour chaque type de bloc
│   │   ├── BlockRenderer.tsx     # Renderer principal
│   │   ├── HeroBlock.tsx
│   │   ├── FeaturesBlock.tsx
│   │   ├── TestimonialsBlock.tsx
│   │   └── ...
│   └── templates/      # Templates de page
│       ├── PageTemplate.tsx      # Renderer principal
│       ├── DefaultTemplate.tsx
│       ├── HomeTemplate.tsx
│       └── ...
└── index.ts           # Exports du module
```

## Utilisation

### 1. Services (Server Components)

Les services peuvent être utilisés directement dans les Server Components Next.js :

```tsx
import { getPageBySlug, getHomePage } from '@/modules/Cms/frontend'

export default async function Page() {
  const page = await getPageBySlug('about')

  return <PageTemplate page={page} />
}
```

### 2. Hooks (Client Components)

Les hooks sont disponibles pour les Client Components :

```tsx
'use client'

import { usePage } from '@/modules/Cms/frontend'

export default function PageComponent({ slug }: { slug: string }) {
  const { page, loading, error } = usePage(slug)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <PageTemplate page={page} />
}
```

### 3. Composants

#### BlockRenderer

Affiche un bloc en fonction de son type :

```tsx
import { BlockRenderer } from '@/modules/Cms/frontend'

<BlockRenderer block={block} />
```

#### PageTemplate

Affiche une page avec le bon template :

```tsx
import { PageTemplate } from '@/modules/Cms/frontend'

<PageTemplate page={page} />
```

## Types de Blocs Disponibles

- **text** - Bloc de texte simple
- **html** - HTML personnalisé
- **hero** - Section hero avec image de fond
- **cta** - Call-to-action
- **features** - Liste de fonctionnalités
- **testimonials** - Témoignages clients
- **gallery** - Galerie d'images
- **video** - Vidéo embarquée
- **contact** - Formulaire de contact
- **faq** - Questions fréquentes
- **pricing** - Tableau de prix
- **team** - Équipe
- **stats** - Statistiques
- **newsletter** - Inscription newsletter

## Templates de Page Disponibles

- **default** - Template standard avec conteneur
- **home** - Template pour page d'accueil (blocs uniquement)
- **contact** - Template pour page de contact (grille 2 colonnes)
- **landing** - Template pour landing page (pleine largeur)
- **full-width** - Template pleine largeur avec hero
- **sidebar** - Template avec barre latérale

## Routes

Les pages CMS sont accessibles via :

- `/cms` - Page d'accueil CMS
- `/cms/[slug]` - Page CMS par slug

Ces routes sont dans `src/app/[lang]/(blank-layout-pages)/cms/`

## Configuration API

L'URL de l'API est configurée via la variable d'environnement :

```env
NEXT_PUBLIC_API_URL=/api
```

Les endpoints utilisés :

- `GET /api/cms/pages` - Liste des pages
- `GET /api/cms/pages/home` - Page d'accueil
- `GET /api/cms/pages/{slug}` - Page par slug
- `GET /api/cms/blocks` - Liste des blocs
- `GET /api/cms/blocks/{identifier}` - Bloc par identifiant
- `GET /api/cms/menus/{identifier}` - Menu par identifiant
- `GET /api/cms/settings` - Paramètres publics

## Exemples

### Afficher une page par slug

```tsx
// app/[lang]/(blank-layout-pages)/cms/[slug]/page.tsx
import { getPageBySlug } from '@/modules/Cms/frontend'
import { PageTemplate } from '@/modules/Cms/frontend'

export default async function CmsPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)

  return <PageTemplate page={page} />
}
```

### Afficher des blocs spécifiques

```tsx
'use client'

import { useMultipleBlocks, BlockRenderer } from '@/modules/Cms/frontend'

export default function CustomPage() {
  const { blocks } = useMultipleBlocks(['hero-home', 'features-main'])

  return (
    <>
      {blocks['hero-home'] && <BlockRenderer block={blocks['hero-home']} />}
      {blocks['features-main'] && <BlockRenderer block={blocks['features-main']} />}
    </>
  )
}
```

### Utiliser les paramètres CMS

```tsx
'use client'

import { useSettings } from '@/modules/Cms/frontend'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer>
      <p>{settings.site_name}</p>
      <p>{settings.site_description}</p>
    </footer>
  )
}
```

## Styling

Les blocs utilisent Material-UI (MUI) pour le styling. Vous pouvez personnaliser les styles via :

1. **Settings du bloc** - Chaque bloc peut avoir des paramètres de style (couleurs, espacements, etc.)
2. **Theme MUI** - Modifier le thème global MUI
3. **CSS personnalisé** - Ajouter des classes CSS via `settings.css_class`

Exemple de style dans un bloc :

```json
{
  "settings": {
    "background_color": "#f5f5f5",
    "text_color": "#333333",
    "padding": "40px",
    "border_radius": "8px"
  }
}
```
