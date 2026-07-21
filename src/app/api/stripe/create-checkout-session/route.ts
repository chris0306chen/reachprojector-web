import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export const runtime = 'nodejs';

const STRIPE_API_URL = 'https://api.stripe.com/v1/checkout/sessions';

function getSiteUrl(request: NextRequest): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/$/, '');
}

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });
    }

    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId : '';
    const quantity = Math.min(Math.max(Number.parseInt(String(body.quantity), 10) || 1, 1), 99);

    if (!productId) {
      return NextResponse.json({ error: 'A product is required.' }, { status: 400 });
    }

    const { data: product, error } = await getSupabaseClient()
      .from('products')
      .select('id, name, price, stock_status, is_active')
      .eq('id', productId)
      .maybeSingle();

    if (error || !product || !product.is_active || product.stock_status !== 'in_stock') {
      return NextResponse.json({ error: 'This product is not available for checkout.' }, { status: 400 });
    }

    const amount = Math.round(Number(product.price) * 100);
    if (!Number.isSafeInteger(amount) || amount < 50) {
      return NextResponse.json({ error: 'Invalid product price.' }, { status: 400 });
    }

    const siteUrl = getSiteUrl(request);
    const form = new URLSearchParams({
      mode: 'payment',
      success_url: `${siteUrl}/en/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/en/products`,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': product.name,
      'line_items[0][price_data][unit_amount]': String(amount),
      'line_items[0][quantity]': String(quantity),
      'metadata[product_id]': product.id,
      'metadata[quantity]': String(quantity),
    });

    const response = await fetch(STRIPE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    const session = await response.json();
    if (!response.ok || !session.url) {
      console.error('[stripe] checkout session error', session);
      return NextResponse.json({ error: 'Unable to create a secure checkout session.' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[stripe] checkout error', error);
    return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 });
  }
}
