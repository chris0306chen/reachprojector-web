import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseClient } from '@/storage/database/supabase-client'
import { hashReviewInvitationToken } from '@/lib/reviews'
import { allowReviewSubmission, getClientIp } from '@/lib/review-security'

const reviewSchema = z.object({
  token: z.string().min(20).max(200),
  review_type: z.enum(['product', 'company']),
  product_rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  service_rating: z.coerce.number().int().min(1).max(5).nullable().optional(),
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10).max(4000),
  display_name: z.string().trim().min(1).max(120),
  country: z.string().trim().min(2).max(100),
  company_name: z.string().trim().max(200).nullable().optional(),
  allow_public_name: z.boolean().default(false),
  allow_public_company: z.boolean().default(false),
  allow_public_image: z.boolean().default(false),
  locale: z.string().trim().max(10).default('en'),
}).superRefine((value, context) => {
  if (value.review_type === 'product' && !value.product_rating) context.addIssue({ code: 'custom', path: ['product_rating'], message: 'Product rating is required' })
  if (value.review_type === 'company' && !value.service_rating) context.addIssue({ code: 'custom', path: ['service_rating'], message: 'Service rating is required' })
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!allowReviewSubmission(`review:${ip}`)) return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
  try {
    const parsed = reviewSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Please complete the required review fields.', issues: parsed.error.flatten() }, { status: 400 })
    const input = parsed.data
    const db = getSupabaseClient()
    const now = new Date().toISOString()
    const { data: invitation, error: invitationError } = await db
      .from('review_invitations')
      .select('id, review_transaction_id, expires_at, used_at, revoked_at, status')
      .eq('token_hash', hashReviewInvitationToken(input.token))
      .maybeSingle()
    if (invitationError) throw invitationError
    if (!invitation || invitation.used_at || invitation.revoked_at || invitation.status !== 'pending' || new Date(invitation.expires_at) <= new Date()) {
      return NextResponse.json({ error: 'This review invitation is invalid or expired.' }, { status: 400 })
    }

    const { data: transaction, error: transactionError } = await db
      .from('review_transactions')
      .select('product_id, source_channel')
      .eq('id', invitation.review_transaction_id)
      .single()
    if (transactionError) throw transactionError
    if (input.review_type === 'product' && !transaction.product_id) return NextResponse.json({ error: 'This invitation is not linked to a product.' }, { status: 400 })

    const { data: review, error: reviewError } = await db.from('reviews').insert({
      review_transaction_id: invitation.review_transaction_id,
      product_id: input.review_type === 'product' ? transaction.product_id : null,
      review_type: input.review_type,
      source_channel: transaction.source_channel,
      verification_status: 'verified',
      moderation_status: 'pending',
      product_rating: input.product_rating ?? null,
      service_rating: input.service_rating ?? null,
      title: input.title,
      body: input.body,
      display_name: input.allow_public_name ? input.display_name : 'Verified customer',
      country: input.country,
      company_name: input.allow_public_company ? (input.company_name || null) : null,
      allow_public_name: input.allow_public_name,
      allow_public_company: input.allow_public_company,
      allow_public_image: input.allow_public_image,
      locale: input.locale,
      submitted_at: now,
    }).select('id').single()
    if (reviewError) {
      if (reviewError.code === '23505') return NextResponse.json({ error: 'This invitation has already been used for this review type.' }, { status: 409 })
      throw reviewError
    }

    const { error: markUsedError } = await db.from('review_invitations').update({ used_at: now, status: 'used' }).eq('id', invitation.id).eq('status', 'pending')
    if (markUsedError) throw markUsedError
    return NextResponse.json({ success: true, review_id: review.id })
  } catch (error) {
    console.error('Failed to submit review', error)
    return NextResponse.json({ error: 'Unable to submit review' }, { status: 500 })
  }
}
