# 🚀 Démarrage Rapide - CMS Frontend

Guide ultra-rapide pour commencer à utiliser le module CMS Frontend en 5 minutes.

## ⚡ Installation en 3 étapes

### 1. Configuration de l'API

Dans `.env` :

```env
NEXT_PUBLIC_API_URL=/api
```

### 2. Import du CSS

Dans `src/app/layout.tsx` :

```tsx
import '@/modules/Cms/frontend/styles/cms-content.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### 3. ✅ C'est tout !

Le module est prêt. Allez sur `/en/cms-demo` pour tester.

## 📝 Premiers pas

### Créer du contenu dans le CMS Admin

1. Allez sur `/en/superadmin/cms/pages`
2. Créez une page :
   - Title: "About"
   - Slug: "about"
   - Status: "published"
   - Active: true
3. Sauvegardez

### Afficher la page

Visitez `/en/cms/about` → Votre page s'affiche ! 🎉

## 🎨 Exemples ultra-rapides

### 1. Page simple

```tsx
// app/[lang]/(blank-layout-pages)/about/page.tsx
import { getPageBySlug, PageTemplate } from '@/modules/Cms/frontend'

export default async function AboutPage() {
  const page = await getPageBySlug('about')
  return <PageTemplate page={page} />
}
```

Accès : `/en/about`

### 2. Bloc hero sur la home

```tsx
'use client'
import { useBlock, BlockRenderer } from '@/modules/Cms/frontend'

export default function Hero() {
  const { block } = useBlock('hero-home')
  return block ? <BlockRenderer block={block} /> : null
}
```

Créez d'abord un bloc "hero-home" dans le CMS Admin.

### 3. Menu header

```tsx
'use client'
import { useMenuByLocation, CmsMenu } from '@/modules/Cms/frontend'

export default function Nav() {
  const { menu } = useMenuByLocation('header')
  return menu ? <CmsMenu items={menu.items} orientation='horizontal' /> : null
}
```

Créez d'abord un menu avec location "header" dans le CMS Admin.

## 🎯 Cas d'usage courants

### Landing page complète

```tsx
'use client'
import { useMultipleBlocks, BlockRenderer } from '@/modules/Cms/frontend'

export default function LandingPage() {
  const { blocks } = useMultipleBlocks([
    'hero-landing',
    'features-landing',
    'testimonials-landing',
    'pricing-landing',
    'cta-landing'
  ])

  return (
    <>
      {Object.values(blocks).map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </>
  )
}
```

### Page avec sidebar

```tsx
// Utilisez le template 'sidebar' dans le CMS
import { getPageBySlug, PageTemplate } from '@/modules/Cms/frontend'

export default async function DocPage() {
  const page = await getPageBySlug('documentation')
  // Template doit être 'sidebar' dans le CMS
  return <PageTemplate page={page} />
}
```

### Layout complet avec CMS

```tsx
// app/[lang]/layout.tsx
import { getMenuByLocation, getPublicSettings } from '@/modules/Cms/frontend/services'
import { CmsHeader, CmsFooter } from '@/modules/Cms/frontend'

export default async function Layout({ children }) {
  const header = await getMenuByLocation('header')
  const footer = await getMenuByLocation('footer')
  const settings = await getPublicSettings()

  return (
    <html>
      <body>
        <CmsHeader menu={header} siteName={settings.site_name} />
        <main>{children}</main>
        <CmsFooter menu={footer} siteName={settings.site_name} />
      </body>
    </html>
  )
}
```

## 📦 Imports disponibles

Tout est exporté depuis `@/modules/Cms/frontend` :

```tsx
import {
  // Services (Server Components)
  getPages,
  getPageBySlug,
  getHomePage,
  getPagesTree,
  getBlocks,
  getBlockByIdentifier,
  getMultipleBlocks,
  getMenuByIdentifier,
  getMenuByLocation,
  getPublicSettings,
  getSettingByKey,
  getMultipleSettings,

  // Hooks (Client Components)
  usePages,
  usePage,
  useHomePage,
  usePagesTree,
  useBlocks,
  useBlock,
  useMultipleBlocks,
  useMenu,
  useMenuByLocation,
  useSettings,
  useSetting,
  useMultipleSettings,

  // Components
  PageTemplate,
  BlockRenderer,
  CmsMenu,
  CmsHeader,
  CmsFooter,

  // Block Components (si besoin direct)
  HeroBlock,
  FeaturesBlock,
  // ... etc
} from '@/modules/Cms/frontend'
```

## 🎨 14 types de blocs

Créez ces types de blocs dans le CMS Admin :

1. **text** - Texte simple
2. **html** - HTML libre
3. **hero** - Hero avec image + CTA
4. **cta** - Call-to-action
5. **features** - Grille de features
6. **testimonials** - Témoignages
7. **gallery** - Galerie photos
8. **video** - Vidéo embarquée
9. **contact** - Formulaire contact
10. **faq** - FAQ accordéon
11. **pricing** - Tarifs
12. **team** - Équipe
13. **stats** - Statistiques
14. **newsletter** - Newsletter

Tous sont rendus automatiquement par `<BlockRenderer />` !

## 📄 6 templates de page

Choisissez le template dans le CMS Admin :

1. **default** - Standard avec container
2. **home** - Page d'accueil (blocs full-width)
3. **contact** - Page contact (2 colonnes)
4. **landing** - Landing page optimisée
5. **full-width** - Pleine largeur
6. **sidebar** - Avec sidebar

Tous sont rendus automatiquement par `<PageTemplate />` !

## 🧪 Tester

1. **Page de demo** : `/en/cms-demo`
   - Affiche tous les éléments CMS
   - Vérifie la connexion API
   - Montre les données disponibles

2. **Routes CMS** :
   - `/en/cms` - Home CMS
   - `/en/cms/[slug]` - Page dynamique

## ❓ Problèmes courants

### Pages vides ?
→ Vérifiez que les pages sont `published` et `is_active: true`

### API ne répond pas ?
→ Vérifiez `NEXT_PUBLIC_API_URL` dans `.env`

### Erreur CORS ?
→ Configurez CORS dans Laravel (si API externe)

### Blocs ne s'affichent pas ?
→ Vérifiez que les blocs sont `is_active: true`

## 📚 Documentation complète

- [Installation détaillée](./INSTALLATION.md)
- [Exemples d'utilisation](./USAGE_EXAMPLES.md)
- [README complet](./README.md)
- [Structure du module](../../../MIGRATION_CMS_FRONTEND.md)

## 🎉 C'est parti !

Vous êtes prêt ! Créez du contenu dans le CMS Admin et affichez-le sur votre frontend.

**Bon développement ! 🚀**
