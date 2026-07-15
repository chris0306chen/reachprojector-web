import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/data-service';

const AIRWALLEX_API_URL = process.env.AIRWALLEX_API_URL || 'https://api.airwallex.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.AIRWALLEX_CLIENT_ID;
  const apiKey = process.env.AIRWALLEX_API_KEY;

  if (!clientId || !apiKey) {
    throw new Error('AIRWALLEX_NOT_CONFIGURED');
  }

  const response = await fetch(`${AIRWALLEX_API_URL}/api/v1/authentication/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-api-key': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intent_id, client_secret, productId, productName, price, quantity = 1, currency = 'USD' } = body;

    if (!intent_id || !client_secret) {
      return NextResponse.json(
        { error: 'Missing required fields: intent_id, client_secret' },
        { status: 400 }
      );
    }

    const clientId = process.env.AIRWALLEX_CLIENT_ID;
    const apiKey = process.env.AIRWALLEX_API_KEY;
    if (!clientId || !apiKey) {
      return NextResponse.json(
        { error: 'Airwallex not configured' },
        { status: 500 }
      );
    }

    const accessToken = await getAccessToken();

    // Confirm the payment intent
    const confirmResponse = await fetch(`${AIRWALLEX_API_URL}/api/v1/pa/payment_intents/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-client-id': clientId,
      },
      body: JSON.stringify({
        id: intent_id,
        request_id: `confirm-${Date.now()}`,
      }),
    });

    if (!confirmResponse.ok) {
      const errorText = await confirmResponse.text();
      return NextResponse.json(
        { error: 'Failed to confirm payment', details: errorText },
        { status: 500 }
      );
    }

    const confirmData = await confirmResponse.json();
    const status = confirmData.status || 'completed';

    // Record order in database
    try {
      await createOrder({
        order_id: `AWX-${Date.now()}`,
        product_id: productId || null,
        product_name: productName || 'Unknown Product',
        quantity: parseInt(quantity.toString()),
        amount: price.toString(),
        currency,
        payer_email: null,
        payer_name: null,
        paypal_order_id: null,
        airwallex_intent_id: intent_id,
        payment_method: 'airwallex',
        status: status === 'succeeded' ? 'completed' : 'pending',
      });
    } catch (dbError) {
      console.error('Failed to record order:', dbError);
      // Don't fail the payment if DB write fails
    }

    return NextResponse.json({
      success: true,
      status,
      intent_id,
      redirect_url: `${process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000'}/order-success?payment=airwallex&intent_id=${intent_id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to capture payment', details: message },
      { status: 500 }
    );
  }
}
