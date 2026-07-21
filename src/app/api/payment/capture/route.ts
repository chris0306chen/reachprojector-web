import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/data-service';
import { getCheckoutItem } from '@/lib/checkout';

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
    const { intent_id, productId, quantity = 1 } = body;

    if (!intent_id || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: intent_id, productId' },
        { status: 400 }
      );
    }

    const item = await getCheckoutItem(productId, quantity);

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
    const status = confirmData.status;
    if (
      status !== 'SUCCEEDED' && status !== 'succeeded' ||
      Number(confirmData.amount) !== Number(item.total) ||
      confirmData.currency !== item.currency ||
      confirmData.metadata?.product_id !== item.id
    ) {
      return NextResponse.json({ error: 'Payment intent does not match the order' }, { status: 409 });
    }

    // Record order in database
    try {
      await createOrder({
        order_id: `AWX-${Date.now()}`,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        amount: item.total,
        currency: item.currency,
        payer_email: null,
        payer_name: null,
        paypal_order_id: null,
        airwallex_intent_id: intent_id,
        payment_method: 'airwallex',
        status: 'completed',
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
