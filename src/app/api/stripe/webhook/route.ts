import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export const runtime = 'nodejs';

function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(',').map((part) => {
    const [key, value] = part.split('=');
    return [key, value];
  }));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();

  if (!secret || !signature || !verifySignature(payload, signature, secret)) {
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  try {
    const event = JSON.parse(payload);
    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const sessionId = String(session.id);
    const client = getSupabaseClient();
    const { data: existing } = await client
      .from('orders')
      .select('id')
      .eq('airwallex_intent_id', sessionId)
      .maybeSingle();

    if (existing) return NextResponse.json({ received: true });

    const productId = String(session.metadata?.product_id || '');
    const quantity = Math.max(1, Number.parseInt(String(session.metadata?.quantity || '1'), 10) || 1);
    const { data: product } = await client
      .from('products')
      .select('name')
      .eq('id', productId)
      .maybeSingle();

    const amount = ((Number(session.amount_total) || 0) / 100).toFixed(2);
    const currency = String(session.currency || 'usd').toUpperCase();
    const customer = session.customer_details || {};

    const { error } = await client.from('orders').insert({
      order_id: `STR-${sessionId}`,
      product_id: productId || null,
      product_name: product?.name || 'Stripe order',
      quantity,
      amount,
      currency,
      payer_email: customer.email || null,
      payer_name: customer.name || null,
      paypal_order_id: null,
      airwallex_intent_id: sessionId,
      payment_method: 'stripe',
      status: 'completed',
    });

    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[stripe] webhook error', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
