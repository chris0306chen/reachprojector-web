import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseClient } from '@/storage/database/supabase-client'
import { getCurrentUser, hasPermission } from '@/lib/auth'

const listSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'hidden']).optional(),
  review_type: z.enum(['product', 'company']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

const updateSchema = z.object({
  id: z.string().uuid(),
  moderation_status: z.enum(['pending', 'approved', 'rejected', 'hidden']).optional(),
  verification_status: z.enum(['unverified', 'verified', 'rejected']).optional(),
  response: z.string().trim().max(3000).optional(),
  response_public: z.boolean().optional(),
})

async function requireReviewManager() {
  const user = await getCurrentUser()
  if (!user) return { user: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (!hasPermission(user, 'reviews')) return { user: null, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { user, response: null }
}

export async function GET(request: NextRequest) {
  const auth = await requireReviewManager()
  if (!auth.user) return auth.response
  const parsed = listSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid review query' }, { status: 400 })
  try {
    let query = getSupabaseClient().from('reviews').select('*, review_media(*), review_responses(*)').order('submitted_at', { ascending: false }).limit(parsed.data.limit)
    if (parsed.data.status) query = query.eq('moderation_status', parsed.data.status)
    if (parsed.data.review_type) query = query.eq('review_type', parsed.data.review_type)
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Failed to list reviews', error)
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireReviewManager()
  if (!auth.user) return auth.response
  try {
    const parsed = updateSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid review update' }, { status: 400 })
    const { id, response, response_public, ...changes } = parsed.data
    const db = getSupabaseClient()
    const now = new Date().toISOString()
    const update = {
      ...changes,
      ...(changes.moderation_status ? { moderated_at: now, moderated_by: auth.user.userId, published_at: changes.moderation_status === 'approved' ? now : null } : {}),
      updated_at: now,
    }
    const { data, error } = await db.from('reviews').update(update).eq('id', id).select('*').single()
    if (error) throw error
    if (response?.trim()) {
      const { error: responseError } = await db.from('review_responses').insert({ review_id: id, responder_user_id: auth.user.userId, body: response.trim(), is_public: response_public ?? true })
      if (responseError) throw responseError
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to update review', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}
