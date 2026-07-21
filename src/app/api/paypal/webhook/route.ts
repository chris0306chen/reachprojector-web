import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatusByPayPalId } from '@/lib/data-service';

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) throw new Error('PAYPAL_NOT_CONFIGURED');

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!response.ok) throw new Error('PAYPAL_AUTH_FAILED');
  return (await response.json()).access_token;
}

function requiredHeader(request: NextRequest, name: string): string {
  const value = request.headers.get(name);
  if (!value) throw new Error(`MISSING_${name.toUpperCase().replaceAll('-', '_')}`);
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    const event = await request.json();
    const accessToken = await getAccessToken();
    const verificationResponse = await fetch(
      `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: requiredHeader(request, 'paypal-auth-algo'),
          cert_url: requiredHeader(request, 'paypal-cert-url'),
          transmission_id: requiredHeader(request, 'paypal-transmission-id'),
          transmission_sig: requiredHeader(request, 'paypal-transmission-sig'),
          transmission_time: requiredHeader(request, 'paypal-transmission-time'),
          webhook_id: webhookId,
          webhook_event: event,
        }),
      }
    );

    if (!verificationResponse.ok) {
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 401 });
    }
    const verification = await verificationResponse.json();
    if (verification.verification_status !== 'SUCCESS') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const paypalOrderId = event.resource?.supplementary_data?.related_ids?.order_id;
    const statusByEvent: Record<string, string> = {
      'PAYMENT.CAPTURE.COMPLETED': 'paid',
      'PAYMENT.CAPTURE.REFUNDED': 'refunded',
      'PAYMENT.CAPTURE.REVERSED': 'refunded',
      'PAYMENT.CAPTURE.DENIED': 'payment_failed',
    };
    const nextStatus = statusByEvent[event.event_type];

    if (paypalOrderId && nextStatus) {
      await updateOrderStatusByPayPalId(paypalOrderId, nextStatus);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
