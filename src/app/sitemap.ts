import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { productNavigation, sceneNavigation } from '@/lib/catalog-navigation'

const SITE_URL = 'https://www.reachprojector.com'

async function fetchProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const { getProducts } = await import('@/lib/data-service')
    const result = await getProducts({ pageSize: 1000 })
    return (result.products ?? []).map((p) => ({
      slug: p.slug,
      updatedAt: new Date(p.updated_at ?? p.created_at ?? Date.now()).toISOString(),
    }))
  } catch (error) {
    console.error('[sitemap] Failed to fetch products:', error)
    return []
  }
}

function buildAlternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of locales) { languages[locale] = `${SITE_URL}/${locale}${path}` }
  languages['x-default'] = `${SITE_URL}/en${path}`
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/products', '/solutions', '/about', '/contact', '/wholesale']
  const staticPages: MetadataRoute.Sitemap = staticPaths.flatMap((path) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}${path}`, lastModified: new Date(), changeFrequency: path === '' ? ('daily' as const) : ('monthly' as const), priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.7, alternates: buildAlternates(path) })))
  const categories = productNavigation.flatMap((category) => [
    category.slug,
    ...category.children.map(([, slug]) => slug),
  ])
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}/products?category=${cat}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8, alternates: buildAlternates(`/products?category=${cat}`) })))
  const scenePages: MetadataRoute.Sitemap = sceneNavigation.flatMap((group) => group.items.flatMap(([, slug]) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}/solutions/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8, alternates: buildAlternates(`/solutions/${slug}`) }))))
  const products = await fetchProductSlugs()
  const productPages: MetadataRoute.Sitemap = products.flatMap((product) => locales.map((locale) => ({ url: `${SITE_URL}/${locale}/products/${product.slug}`, lastModified: new Date(product.updatedAt), changeFrequency: 'weekly' as const, priority: 0.6, alternates: buildAlternates(`/products/${product.slug}`) })))
  return [...staticPages, ...categoryPages, ...scenePages, ...productPages]
}
