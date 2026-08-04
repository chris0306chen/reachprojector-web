import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutItem } from '@/lib/checkout';
import {
  createPaidOrder,
  getOrderByStripeSessionId,
  refundStripeOrderAndRestoreInventory,
  updateOrderStatusByStripePaymentIntent,
} from '@/lib/data-service';
import { sendOrderConfirmation } from '@/lib/order-email';
import { getShippingQuote } from '@/lib/shipping';
import { formatShippingAddress } from '@/lib/order-address';

export const runtime = 'nodejs';

interface StripeEvent {
  id: string;
  type: string;
  data?: { object?: Record<string, unknown> };
}

function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = header.split(',');
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`, 'utf8').digest();
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const supplied = Buffer.from(signature, 'hex');
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  });
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get('stripe-signature');
    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    const rawBody = await request.text();
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as StripeEvent;
    const object = event.data?.object || {};

    if (event.type === 'checkout.session.completed') {
      const sessionId = stringValue(object.id);
      const paymentStatus = stringValue(object.payment_status);
      const metadata = (object.metadata || {}) as Record<string, unknown>;
      const productId = stringValue(metadata.product_id);
      const countryCode = stringValue(metadata.country_code)?.toUpperCase() || '';
      const quantity = Number(metadata.quantity);
      if (!sessionId || paymentStatus !== 'paid' || !productId) {
        return NextResponse.json({ received: true });
      }

      const existing = await getOrderByStripeSessionId(sessionId);
      if (!existing) {
        const item = await getCheckoutItem(productId, quantity);
        const shipping = await getShippingQuote(item.id, countryCode, item.quantity);
        if (shipping.mode !== 'automatic' || shipping.currency !== item.currency) {
          console.error('Stripe paid session shipping could not be verified:', event.id);
          return NextResponse.json({ error: 'Shipping amount mismatch' }, { status: 409 });
        }
        const orderTotal = (Number(item.total) + shipping.shippingCost).toFixed(2);
        const amountTotal = Number(object.amount_total);
        const currency = stringValue(object.currency)?.toUpperCase();
        if (amountTotal !== Math.round(Number(orderTotal) * 100) || currency !== item.currency) {
          console.error('Stripe paid session did not match catalog:', event.id);
          return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 409 });
        }

        const customerDetails = (object.customer_details || {}) as Record<string, unknown>;
        const collectedInformation = (object.collected_information || {}) as Record<string, unknown>;
        const shippingDetails = (
          object.shipping_details
          || collectedInformation.shipping_details
          || {}
        ) as Record<string, unknown>;
        const shippingAddress = (shippingDetails.address || {}) as Record<string, unknown>;
        const shippingCountry = stringValue(shippingAddress.country)?.toUpperCase();
        if (shippingCountry !== countryCode) {
          console.error('Stripe shipping country did not match quoted country:', event.id);
          return NextResponse.json({ error: 'Shipping country mismatch' }, { status: 409 });
        }
        const customerPhone = stringValue(shippingDetails.phone) || stringValue(customerDetails.phone);
        const shippingAddressText = formatShippingAddress({
          name: stringValue(shippingDetails.name) || stringValue(customerDetails.name),
          phone: customerPhone,
          line1: stringValue(shippingAddress.line1),
          line2: stringValue(shippingAddress.line2),
          city: stringValue(shippingAddress.city),
          state: stringValue(shippingAddress.state),
          postalCode: stringValue(shippingAddress.postal_code),
          country: shippingCountry,
        });
        if (!shippingAddressText) {
          console.error('Stripe paid session did not include a delivery address:', event.id);
          return NextResponse.json({ error: 'Delivery address missing' }, { status: 409 });
        }
        const order = await createPaidOrder({
          order_id: `ORD-STRIPE-${sessionId.slice(-18)}`,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          amount: orderTotal,
          currency: item.currency,
          payer_email: stringValue(customerDetails.email),
          payer_name: stringValue(customerDetails.name),
          paypal_order_id: null,
          stripe_session_id: sessionId,
          stripe_payment_intent_id: stringValue(object.payment_intent),
          airwallex_intent_id: null,
          payment_method: 'stripe',
          payment_status: 'paid',
          country: countryCode,
          customer_phone: customerPhone,
          shipping_address: shippingAddressText,
          shipping_method: `${shipping.method} (${shipping.tradeTerms})`,
          shipping_cost: shipping.shippingCost.toFixed(2),
          status: 'preparing',
        });
        sendOrderConfirmation({
          orderId: order.order_id,
          productName: item.name,
          quantity: item.quantity,
          amount: orderTotal,
          currency: item.currency,
          customerEmail: stringValue(customerDetails.email),
          paymentMethod: 'stripe',
          shippingMethod: `${shipping.method} (${shipping.tradeTerms})`,
          shippingAddress: shippingAddressText,
        }).catch((emailError) => console.error('Stripe confirmation email failed:', emailError));
      }
    }

    if (event.type === 'charge.refunded') {
      const paymentIntentId = stringValue(object.payment_intent);
      const amount = Number(object.amount);
      const amountRefunded = Number(object.amount_refunded);
      if (paymentIntentId && Number.isFinite(amount) && amountRefunded >= amount) {
        await refundStripeOrderAndRestoreInventory(paymentIntentId);
      } else if (paymentIntentId) {
        await updateOrderStatusByStripePaymentIntent(paymentIntentId, 'partially_refunded');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
