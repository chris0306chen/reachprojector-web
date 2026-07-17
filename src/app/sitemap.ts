import type { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n/config'

const SITE_URL = 'https://www.reachprojector.com'

async function fetchProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data, error } = await supabase.from('products').select('slug, updated_at').eq('is_active', true)
    if (error) { console.error('[sitemap] Failed to fetch products:', error.message); return [] }
    return (data ?? []).map((p: { slug: string; updated_at: string | null }) => ({ slug: p.slug, updatedAt: p.updated_at ?? new Date().toISOString() }))
  } catch (error) { console.error('[sitemap] Failed to fetch products:', error); return [] }
}

function buildAlternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of locales) { languages[locale] = `${SITE_URL}/${locale}${path}` }
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/products', '/about', '/contact', '/wholesale', '/shipping-policy']
  const staticPages: MetadataRoute.Sitemap = staticPaths.flatMap((path) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}${path}`, lastModified: new Date(), changeFrequency: path === '' ? ('daily' as const) : ('monthly' as const), priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.7, alternates: buildAlternates(path) })))
  const categories = ['4k-laser-projectors', 'ust-laser-tv', 'printers-scanners', 'components']
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}/products?category=${cat}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8, alternates: buildAlternates(`/products?category=${cat}`) })))
  const products = await fetchProductSlugs()
  const productPages: MetadataRoute.Sitemap = products.flatMap((product) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}/products/${product.slug}`, lastModified: new Date(product.updatedAt), changeFrequency: 'weekly' as const, priority: 0.6, alternates: buildAlternates(`/products/${product.slug}`) })))
  return [...staticPages, ...categoryPages, ...productPages]
}
