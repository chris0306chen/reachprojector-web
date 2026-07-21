import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutItem } from '@/lib/checkout';

const AIRWALLEX_API_URL = process.env.AIRWALLEX_API_URL || 'https://api.airwallex.com';

interface AirwallexTokenResponse {
  token: string;
  expires_in: number;
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.AIRWALLEX_CLIENT_ID;
  const apiKey = process.env.AIRWALLEX_API_KEY;

  if (!clientId || !apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${AIRWALLEX_API_URL}/api/v1/authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: AirwallexTokenResponse = await response.json();
    return data.token;
  } catch {
    return null;
  }
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

    const item = await getCheckoutItem(productId, quantity);

    // Check if Airwallex is configured
    const clientId = process.env.AIRWALLEX_CLIENT_ID;
    const apiKey = process.env.AIRWALLEX_API_KEY;
    if (!clientId || !apiKey) {
      return NextResponse.json({
        configured: false,
        message: 'Airwallex is not configured. Please set valid AIRWALLEX_CLIENT_ID and AIRWALLEX_API_KEY in environment variables.',
      });
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({
        configured: false,
        message: 'Airwallex authentication failed. Please verify your AIRWALLEX_CLIENT_ID and AIRWALLEX_API_KEY credentials.',
      });
    }

    const totalAmount = item.total;
    const merchantOrderId = `AWX-${Date.now()}`;

    // Create Payment Intent
    const intentResponse = await fetch(`${AIRWALLEX_API_URL}/api/v1/pa/payment_intents/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-client-id': clientId,
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: item.currency,
        merchant_order_id: merchantOrderId,
        request_id: `req-${Date.now()}`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reachprojector.com'}/en/order-success?payment=airwallex`,
        cancel_url: `${process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000'}/products/${productId}`,
        metadata: {
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity.toString(),
        },
      }),
    });

    if (!intentResponse.ok) {
      const errorText = await intentResponse.text();
      return NextResponse.json(
        { error: 'Failed to create payment intent', details: errorText },
        { status: 500 }
      );
    }

    const intentData = await intentResponse.json();

    return NextResponse.json({
      configured: true,
      client_secret: intentData.client_secret,
      intent_id: intentData.id,
      amount: totalAmount,
      currency: item.currency,
      merchant_order_id: merchantOrderId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'AIRWALLEX_NOT_CONFIGURED') {
      return NextResponse.json({
        configured: false,
        message: 'Airwallex credentials not configured.',
      });
    }
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: message },
      { status: 500 }
    );
  }
}
