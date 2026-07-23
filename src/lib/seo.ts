/**
 * SEO Utility Functions for REACH PROJECTOR
 * 
 * Provides structured data generators and metadata helpers for
 * product pages, breadcrumbs, and FAQ content.
 * 
 * Usage:
 *   import { generateProductMetadata, generateProductSchema, ... } from '@/lib/seo'
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reachprojector.com').replace(/\/$/, '')
export const SITE_NAME = 'REACH PROJECTOR'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductSEOData {
  name: string
  brand: string
  description: string
  image: string
  price: number
  originalPrice?: number
  currency: string
  sku: string
  category: string
  availability: 'in_stock' | 'out_of_stock' | 'preorder'
  rating?: number
  reviewCount?: number
  locale?: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

// ---------------------------------------------------------------------------
// Product Page Metadata (for Next.js generateMetadata)
// ---------------------------------------------------------------------------

export function generateProductMetadata(product: ProductSEOData) {
  const title = `${product.name} ${product.brand} | Wholesale Price | ${SITE_NAME}`
  const truncatedDesc =
    product.description.length > 155
      ? `${product.description.slice(0, 155)}...`
      : product.description
  const description = `${truncatedDesc} In stock, ready to ship worldwide with DDP. Wholesale pricing available.`

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      `${product.brand.toLowerCase()} ${product.category.toLowerCase()}`,
      `${product.category.toLowerCase()} wholesale`,
      `${product.category.toLowerCase()} supplier`,
      'ddp shipping',
    ],
    openGraph: {
      title,
      description,
      type: 'website' as const,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: `${product.name} ${product.brand}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `${SITE_URL}/products/${product.sku}`,
    },
  }
}

// ---------------------------------------------------------------------------
// Product Schema (JSON-LD)
// ---------------------------------------------------------------------------

export function generateProductSchema(product: ProductSEOData) {
  const availabilityMap: Record<ProductSEOData['availability'], string> = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    preorder: 'https://schema.org/PreOrder',
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    description: product.description,
    image: product.image,
    sku: product.sku,
    mpn: product.sku,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: availabilityMap[product.availability],
      url: `${SITE_URL}/${product.locale || 'en'}/products/${product.sku}`,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      ...(product.originalPrice
        ? {
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: product.price,
              priceCurrency: product.currency,
            },
          }
        : {}),
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// Breadcrumb Schema (JSON-LD)
// ---------------------------------------------------------------------------

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

// ---------------------------------------------------------------------------
// FAQ Schema (JSON-LD)
// ---------------------------------------------------------------------------

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ---------------------------------------------------------------------------
// ItemList Schema (JSON-LD) 鈥?for product listing pages
// ---------------------------------------------------------------------------

export function generateItemListSchema(
  items: { name: string; slug: string; price: number }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}/products/${item.slug}`,
      offers: {
        '@type': 'Offer',
        price: item.price,
        priceCurrency: 'USD',
      },
    })),
  }
}

// ---------------------------------------------------------------------------
// Organization Schema (JSON-LD) 鈥?for layout.tsx
// ---------------------------------------------------------------------------

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'HK REACH SOURCING LIMITED',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      'Projection solutions supplier for home cinema, hospitality, education, events, integrators, and retail partners.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-13655920080',
      contactType: 'sales',
      email: 'info@reachtronics.com',
      availableLanguage: ['English', 'Chinese'],
    },
    sameAs: [] as string[],
  }
}

// ---------------------------------------------------------------------------
// WebSite Schema (JSON-LD) 鈥?for homepage
// ---------------------------------------------------------------------------

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Projectors, projection screens, mounts, and scenario-based projection solutions for retail and business customers.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/en/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
