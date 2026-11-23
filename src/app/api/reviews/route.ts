import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPublicCompanyReviews, getPublicProductReviews } from '@/lib/reviews'

const querySchema = z.object({
  product_id: z.string().max(36).optional(),
  review_type: z.enum(['product', 'company']).default('product'),
})

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid review query' }, { status: 400 })
  try {
    const reviews = parsed.data.review_type === 'company'
      ? await getPublicCompanyReviews()
      : parsed.data.product_id ? await getPublicProductReviews(parsed.data.product_id) : []
    return NextResponse.json({ data: reviews })
  } catch (error) {
    console.error('Failed to fetch public reviews', error)
    return NextResponse.json({ error: 'Reviews are temporarily unavailable' }, { status: 500 })
  }
}
