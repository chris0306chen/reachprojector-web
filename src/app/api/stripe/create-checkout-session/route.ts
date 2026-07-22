import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutItem } from '@/lib/checkout';
import { locales, defaultLocale } from '@/i18n/config';

const STRIPE_API_URL = 'https://api.stripe.com/v1/checkout/sessions';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://reachprojector.com').replace(/\/$/, '');

function append(params: URLSearchParams, key: string, value: string | number) {
  params.append(key, String(value));
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || !secretKey.startsWith('sk_')) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
    }

    const body = await request.json();
    const item = await getCheckoutItem(body.productId, body.quantity);
    const requestedLocale = typeof body.locale === 'string' ? body.locale : defaultLocale;
    const locale = locales.includes(requestedLocale as (typeof locales)[number]) ? requestedLocale : defaultLocale;
    const unitAmount = Math.round(item.unitPrice * 100);
    if (!Number.isSafeInteger(unitAmount) || unitAmount < 1) {
      return NextResponse.json({ error: 'Invalid catalog price' }, { status: 409 });
    }

    const params = new URLSearchParams();
    append(params, 'mode', 'payment');
    append(params, 'success_url', `${SITE_URL}/${locale}/order-success?session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(item.name)}`);
    append(params, 'cancel_url', `${SITE_URL}/${locale}/products`);
    append(params, 'customer_creation', 'always');
    append(params, 'client_reference_id', item.id);
    append(params, 'line_items[0][price_data][currency]', item.currency.toLowerCase());
    append(params, 'line_items[0][price_data][unit_amount]', unitAmount);
    append(params, 'line_items[0][price_data][product_data][name]', item.name);
    append(params, 'line_items[0][quantity]', item.quantity);
    append(params, 'metadata[product_id]', item.id);
    append(params, 'metadata[quantity]', item.quantity);

    const response = await fetch(STRIPE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    const session = await response.json();
    if (!response.ok || typeof session.url !== 'string' || !session.url.startsWith('https://checkout.stripe.com/')) {
      console.error('Stripe session creation failed:', session?.error?.type || response.status);
      return NextResponse.json({ error: 'Unable to start card checkout' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = ['INVALID_PRODUCT', 'INVALID_QUANTITY'].includes(message) ? 400 : 500;
    console.error('Stripe Checkout error:', message || error);
    return NextResponse.json({ error: status === 400 ? 'Invalid checkout request' : 'Unable to start card checkout' }, { status });
  }
}
