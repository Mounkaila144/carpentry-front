/**
 * CMS Frontend Module Exports
 * Public components, hooks, and services for frontend CMS consumption
 */

// Services
export * from './services/pageService'
export * from './services/blockService'
export * from './services/menuService'
export * from './services/settingsService'

// Hooks
export * from './hooks/usePages'
export * from './hooks/useBlocks'
export * from './hooks/useMenus'
export * from './hooks/useSettings'

// Components
export { default as BlockRenderer } from './components/blocks/BlockRenderer'
export { default as PageTemplate } from './components/templates/PageTemplate'
export { default as CmsMenu } from './components/CmsMenu'
export { default as CmsHeader } from './components/CmsHeader'
export { default as CmsFooter } from './components/CmsFooter'

// Block Components
export { default as TextBlock } from './components/blocks/TextBlock'
export { default as HtmlBlock } from './components/blocks/HtmlBlock'
export { default as HeroBlock } from './components/blocks/HeroBlock'
export { default as CtaBlock } from './components/blocks/CtaBlock'
export { default as FeaturesBlock } from './components/blocks/FeaturesBlock'
export { default as TestimonialsBlock } from './components/blocks/TestimonialsBlock'
export { default as GalleryBlock } from './components/blocks/GalleryBlock'
export { default as VideoBlock } from './components/blocks/VideoBlock'
export { default as ContactBlock } from './components/blocks/ContactBlock'
export { default as FaqBlock } from './components/blocks/FaqBlock'
export { default as PricingBlock } from './components/blocks/PricingBlock'
export { default as TeamBlock } from './components/blocks/TeamBlock'
export { default as StatsBlock } from './components/blocks/StatsBlock'
export { default as NewsletterBlock } from './components/blocks/NewsletterBlock'

// Template Components
export { default as DefaultTemplate } from './components/templates/DefaultTemplate'
export { default as HomeTemplate } from './components/templates/HomeTemplate'
export { default as ContactTemplate } from './components/templates/ContactTemplate'
export { default as LandingTemplate } from './components/templates/LandingTemplate'
export { default as FullWidthTemplate } from './components/templates/FullWidthTemplate'
export { default as SidebarTemplate } from './components/templates/SidebarTemplate'
