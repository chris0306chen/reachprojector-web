import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrderByPayPalId } from '@/lib/data-service';
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
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity = 1 } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 }
      );
    }

    // A browser retry must return the original order instead of capturing twice.
    const existingOrder = await getOrderByPayPalId(orderId);
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        status: 'COMPLETED',
        order: existingOrder,
        idempotent: true,
      });
    }

    // Check if PayPal is configured
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    if (!clientId || !secret || clientId.startsWith('YOUR_') || secret.startsWith('YOUR_')) {
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

    const item = await getCheckoutItem(productId, quantity);
    const purchaseUnit = captureData.purchase_units?.[0];
    const captured = purchaseUnit?.payments?.captures?.[0]?.amount;
    if (
      captureData.status !== 'COMPLETED' ||
      purchaseUnit?.reference_id !== item.id ||
      captured?.currency_code !== item.currency ||
      captured?.value !== item.total
    ) {
      return NextResponse.json({ error: 'Captured payment does not match the order' }, { status: 409 });
    }

    // Extract payer info
    const payer = captureData.payer || {};
    const payerEmail = payer.email_address || null;
    const payerName = payer.name
      ? `${payer.name.given_name || ''} ${payer.name.surname || ''}`.trim()
      : null;

    // Save order to database
    let orderRecord;
    try {
      orderRecord = await createOrder({
        order_id: `ORD-${Date.now()}`,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        amount: item.total,
        currency: item.currency,
        payer_email: payerEmail,
        payer_name: payerName,
        paypal_order_id: orderId,
        airwallex_intent_id: null,
        payment_method: 'paypal',
        status: 'paid',
      });
    } catch (writeError) {
      // With the unique PayPal order index, concurrent retries converge here.
      const concurrentOrder = await getOrderByPayPalId(orderId);
      if (!concurrentOrder) throw writeError;
      orderRecord = concurrentOrder;
    }

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
