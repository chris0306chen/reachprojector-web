import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/storage/database/supabase-client'
import { hashReviewInvitationToken } from '@/lib/reviews'
import { allowReviewSubmission, getClientIp } from '@/lib/review-security'
import { reviewSubmissionSchema } from '@/lib/review-validation'

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!allowReviewSubmission(`review:${ip}`)) return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
  try {
    const isMultipart = request.headers.get('content-type')?.includes('multipart/form-data')
    let rawInput: Record<string, unknown>
    let image: File | null = null
    if (isMultipart) {
      const form = await request.formData()
      const value = (name: string) => String(form.get(name) || '')
      rawInput = {
        token: value('token'), review_type: value('review_type'), product_rating: value('product_rating') || null,
        service_rating: value('service_rating') || null, title: value('title'), body: value('body'),
        display_name: value('display_name'), country: value('country'), company_name: value('company_name') || null,
        allow_public_name: form.get('allow_public_name') === 'on', allow_public_company: form.get('allow_public_company') === 'on',
        allow_public_image: form.get('allow_public_image') === 'on', locale: value('locale') || 'en',
      }
      const uploaded = form.get('image')
      image = uploaded instanceof File && uploaded.size > 0 ? uploaded : null
    } else {
      rawInput = await request.json() as Record<string, unknown>
    }
    if (image && (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type) || image.size > 5 * 1024 * 1024)) {
      return NextResponse.json({ error: 'Images must be JPG, PNG or WebP and no larger than 5MB.' }, { status: 400 })
    }
    const parsed = reviewSubmissionSchema.safeParse(rawInput)
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

    if (image) {
      const bucket = 'review-media'
      const { data: buckets } = await db.storage.listBuckets()
      if (!buckets?.some((bucketInfo) => bucketInfo.name === bucket)) await db.storage.createBucket(bucket, { public: false, fileSizeLimit: 5 * 1024 * 1024 })
      const safeName = image.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(0, 160)
      const storagePath = `${review.id}/${Date.now()}-${safeName}`
      const { error: uploadError } = await db.storage.from(bucket).upload(storagePath, image, { contentType: image.type, upsert: false })
      if (uploadError) throw uploadError
      const { error: mediaError } = await db.from('review_media').insert({ review_id: review.id, storage_path: storagePath, is_public: input.allow_public_image })
      if (mediaError) throw mediaError
    }

    const { error: markUsedError } = await db.from('review_invitations').update({ used_at: now, status: 'used' }).eq('id', invitation.id).eq('status', 'pending')
    if (markUsedError) throw markUsedError
    return NextResponse.json({ success: true, review_id: review.id })
  } catch (error) {
    console.error('Failed to submit review', error)
    return NextResponse.json({ error: 'Unable to submit review' }, { status: 500 })
  }
}
