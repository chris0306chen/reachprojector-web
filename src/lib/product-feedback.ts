export interface ExternalProductFeedback {
  source: string
  country: string
  rating: 1 | 2 | 3 | 4 | 5
  dateLabel: string
  summary: string
}

const viddaC3UltraFeedback: ExternalProductFeedback[] = [
  {
    source: 'Alibaba International customer feedback',
    country: 'United States',
    rating: 5,
    dateLabel: 'Seller-recorded feedback',
    summary: 'Customer feedback mentions early delivery, clear daytime picture performance and responsive service support.',
  },
  {
    source: 'Alibaba International customer feedback',
    country: 'France',
    rating: 5,
    dateLabel: 'Seller-recorded feedback',
    summary: 'Customer feedback highlights the build quality, initial setup experience and menu usability.',
  },
]

function isViddaC3Ultra(value: string): boolean {
  return /vidda[\s_-]*c3[\s_-]*ultra/i.test(value) || /c3[\s_-]*ultra/i.test(value)
}

export function getExternalProductFeedback(product: { name?: string | null; slug?: string | null }): ExternalProductFeedback[] {
  const identity = `${product.name || ''} ${product.slug || ''}`
  return isViddaC3Ultra(identity) ? viddaC3UltraFeedback : []
}
