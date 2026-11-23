import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseClient } from '@/storage/database/supabase-client'
import { createReviewInvitationToken, hashReviewInvitationToken } from '@/lib/reviews'
import { getCurrentUser, hasPermission } from '@/lib/auth'

const invitationSchema = z.object({
  product_id: z.string().max(36).nullable().optional(),
  order_id: z.string().max(36).nullable().optional(),
  source_channel: z.enum(['website', 'Alibaba', 'WhatsApp', 'manual']),
  sale_channel: z.enum(['website', 'Alibaba', 'WhatsApp', 'manual']),
  external_reference: z.string().trim().max(255).nullable().optional(),
  customer_email: z.string().trim().email().max(255).nullable().optional(),
  customer_name: z.string().trim().max(120).nullable().optional(),
  country: z.string().trim().max(100).nullable().optional(),
  quantity: z.coerce.number().int().positive().nullable().optional(),
  transaction_date: z.string().date().nullable().optional(),
  expires_in_days: z.coerce.number().int().min(1).max(90).default(30),
}).refine((value) => value.order_id || value.external_reference, { message: 'order_id or external_reference is required' })

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasPermission(user, 'reviews')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const parsed = invitationSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid transaction or invitation data' }, { status: 400 })
    const input = parsed.data
    const token = createReviewInvitationToken()
    const expiresAt = new Date(Date.now() + input.expires_in_days * 86400000).toISOString()
    const db = getSupabaseClient()
    const { data: transaction, error: transactionError } = await db.from('review_transactions').insert({
      product_id: input.product_id || null,
      order_id: input.order_id || null,
      source_channel: input.source_channel,
      sale_channel: input.sale_channel,
      external_reference: input.external_reference || null,
      customer_email: input.customer_email || null,
      customer_email_hash: input.customer_email ? hashReviewInvitationToken(input.customer_email.toLowerCase()) : null,
      customer_name: input.customer_name || null,
      country: input.country || null,
      quantity: input.quantity || null,
      transaction_date: input.transaction_date || null,
      verified_at: new Date().toISOString(),
      verified_by: user.userId,
    }).select('id').single()
    if (transactionError) throw transactionError
    const { data: invitation, error: invitationError } = await db.from('review_invitations').insert({
      review_transaction_id: transaction.id,
      token_hash: hashReviewInvitationToken(token),
      recipient_email: input.customer_email || null,
      expires_at: expiresAt,
      created_by: user.userId,
    }).select('id, expires_at').single()
    if (invitationError) throw invitationError
    return NextResponse.json({ success: true, invitation: { id: invitation.id, expires_at: invitation.expires_at, token } }, { status: 201 })
  } catch (error) {
    console.error('Failed to create review invitation', error)
    return NextResponse.json({ error: 'Failed to create review invitation' }, { status: 500 })
  }
}
