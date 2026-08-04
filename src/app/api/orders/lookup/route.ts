import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const SAFE_FIELDS = 'order_id, product_name, quantity, amount, currency, payer_email, country, shipping_address, payment_method, payment_status, shipping_method, shipping_cost, tracking_number, status, created_at';

function safeOrder(order: Record<string, unknown>) {
  return {
    ...order,
    payer_email: undefined,
  };
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')?.trim();
  const paypalOrderId = request.nextUrl.searchParams.get('paypal_order_id')?.trim();
  const validSession = Boolean(sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId) && sessionId.length <= 255);
  const validPayPalOrder = Boolean(paypalOrderId && /^[A-Z0-9]{10,30}$/.test(paypalOrderId));
  if (!validSession && !validPayPalOrder) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .select(SAFE_FIELDS)
    .eq(validSession ? 'stripe_session_id' : 'paypal_order_id', validSession ? sessionId : paypalOrderId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: 'Unable to retrieve order' }, { status: 500 });
  if (!data) return NextResponse.json({ pending: true }, { status: 202 });
  return NextResponse.json({ order: safeOrder(data) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const orderId = typeof body.orderId === 'string' ? body.orderId.trim().toUpperCase() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^ORD-[A-Z0-9-]{4,90}$/.test(orderId) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid order number and email' }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .select(SAFE_FIELDS)
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: 'Unable to retrieve order' }, { status: 500 });
  if (!data || String(data.payer_email || '').toLowerCase() !== email) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order: safeOrder(data) });
}
