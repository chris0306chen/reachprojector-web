import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/data-service';

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret || clientId === 'YOUR_SANDBOX_CLIENT_ID' || secret === 'YOUR_SANDBOX_SECRET') {
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
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, productName, price, quantity = 1, currency = 'USD' } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 }
      );
    }

    // Check if PayPal is configured
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    if (!clientId || !secret || clientId === 'YOUR_SANDBOX_CLIENT_ID' || secret === 'YOUR_SANDBOX_SECRET') {
      return NextResponse.json({
        configured: false,
        message: 'PayPal is not configured. Please set valid PAYPAL_CLIENT_ID and PAYPAL_SECRET in environment variables.',
      });
    }

    const accessToken = await getAccessToken();

    const captureResponse = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      throw new Error(`PayPal capture failed: ${error}`);
    }

    const captureData = await captureResponse.json();

    // Extract payer info
    const payer = captureData.payer || {};
    const payerEmail = payer.email_address || null;
    const payerName = payer.name
      ? `${payer.name.given_name || ''} ${payer.name.surname || ''}`.trim()
      : null;

    // Save order to database
    const orderRecord = await createOrder({
      order_id: `ORD-${Date.now()}`,
      product_id: productId || null,
      product_name: productName || 'Unknown Product',
      quantity: quantity || 1,
      amount: price || captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0',
      currency: currency || 'USD',
      payer_email: payerEmail,
      payer_name: payerName,
      paypal_order_id: orderId,
      status: captureData.status === 'COMPLETED' ? 'completed' : 'pending',
    });

    return NextResponse.json({
      success: true,
      status: captureData.status,
      order: orderRecord,
      payer: {
        email: payerEmail,
        name: payerName,
      },
    });
  } catch (error) {
    console.error('Capture order error:', error);
    const message = error instanceof Error ? error.message : 'Failed to capture order';
    if (message === 'PAYPAL_NOT_CONFIGURED') {
      return NextResponse.json(
        { error: 'PayPal is not configured. Please set valid PAYPAL_CLIENT_ID and PAYPAL_SECRET in environment variables.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
