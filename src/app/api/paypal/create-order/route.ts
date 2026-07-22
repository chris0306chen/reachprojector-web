import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutItem } from '@/lib/checkout';

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret || clientId.startsWith('YOUR_') || secret.startsWith('YOUR_')) {
    throw new Error('PAYPAL_NOT_CONFIGURED');
  }

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    console.error('PayPal access token request failed:', response.status);
    throw new Error('PAYPAL_AUTH_FAILED');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing required field: productId' },
        { status: 400 }
      );
    }

    // Price, name and currency always come from the catalog, never the browser.
    const item = await getCheckoutItem(productId, quantity);

    // Check if PayPal is configured
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    if (!clientId || !secret || clientId.startsWith('YOUR_') || secret.startsWith('YOUR_')) {
      return NextResponse.json({
        configured: false,
        message: 'PayPal is not configured. Please set valid PAYPAL_CLIENT_ID and PAYPAL_SECRET in environment variables.',
        demoOrderId: `DEMO-${Date.now()}`,
      });
    }

    const accessToken = await getAccessToken();

    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: item.id,
            description: item.name,
            amount: {
              currency_code: item.currency,
              value: item.total,
            },
          },
        ],
      }),
    });

    if (!paypalResponse.ok) {
      console.error('PayPal order creation failed:', paypalResponse.status);
      throw new Error('PAYPAL_ORDER_FAILED');
    }

    const order = await paypalResponse.json();

    return NextResponse.json({ orderId: order.id, status: order.status });
  } catch (error) {
    console.error('Create order error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    if (message === 'PAYPAL_NOT_CONFIGURED') {
      return NextResponse.json(
        { error: 'PayPal is not configured. Please set valid PAYPAL_CLIENT_ID and PAYPAL_SECRET in environment variables.' },
        { status: 400 }
      );
    }
    if (message === 'PAYPAL_AUTH_FAILED') {
      return NextResponse.json(
        { error: 'PayPal is temporarily unavailable' },
        { status: 503 }
      );
    }
    if (message === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (['PRODUCT_UNAVAILABLE', 'INVALID_CATALOG_PRICE'].includes(message)) {
      return NextResponse.json({ error: 'Product is unavailable' }, { status: 409 });
    }
    if (['INVALID_PRODUCT', 'INVALID_QUANTITY'].includes(message)) {
      return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Unable to start PayPal checkout' },
      { status: 502 }
    );
  }
}
