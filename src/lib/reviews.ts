import { createHash, randomBytes } from 'node:crypto'
import { getSupabaseClient } from '@/storage/database/supabase-client'

export const REVIEW_CHANNELS = ['website', 'Alibaba', 'WhatsApp', 'manual'] as const
export type ReviewChannel = typeof REVIEW_CHANNELS[number]
export type ReviewType = 'product' | 'company'

export interface PublicReview {
  id: string
  review_type: ReviewType
  product_id: string | null
  product_rating: number | null
  service_rating: number | null
  title: string
  body: string
  display_name: string
  country: string
  company_name: string | null
  locale: string
  allow_public_name: boolean
  submitted_at: string
  published_at: string | null
}

export function hashReviewInvitationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function createReviewInvitationToken(): string {
  return randomBytes(32).toString('base64url')
}

export async function getPublicProductReviews(productId: string): Promise<PublicReview[]> {
  const { data, error } = await getSupabaseClient()
    .from('reviews')
    .select('id, review_type, product_id, product_rating, service_rating, title, body, display_name, country, company_name, locale, allow_public_name, submitted_at, published_at')
    .eq('product_id', productId)
    .eq('review_type', 'product')
    .eq('moderation_status', 'approved')
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data || []) as PublicReview[]
}

export async function getPublicCompanyReviews(): Promise<PublicReview[]> {
  const { data, error } = await getSupabaseClient()
    .from('reviews')
    .select('id, review_type, product_id, product_rating, service_rating, title, body, display_name, country, company_name, locale, allow_public_name, submitted_at, published_at')
    .eq('review_type', 'company')
    .eq('moderation_status', 'approved')
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data || []) as PublicReview[]
}

export function averageReviewRating(reviews: PublicReview[], field: 'product_rating' | 'service_rating'): number | null {
  const values = reviews.map((review) => review[field]).filter((value): value is number => typeof value === 'number')
  if (!values.length) return null
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
}
