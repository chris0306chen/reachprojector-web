import { sendEmail } from '@/lib/email';

interface OrderConfirmationInput {
  orderId: string;
  productName: string;
  quantity: number;
  amount: string;
  currency: string;
  customerEmail: string | null;
  paymentMethod: 'paypal' | 'stripe';
  shippingMethod?: string;
  shippingAddress?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function validEmail(value: string | null): value is string {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

export async function sendOrderConfirmation(input: OrderConfirmationInput): Promise<void> {
  const businessEmail = 'info@reachtronics.com';
  const customerEmail = validEmail(input.customerEmail) ? input.customerEmail : null;
  const recipient = customerEmail || businessEmail;
  const method = input.paymentMethod === 'stripe' ? 'Card (Stripe)' : 'PayPal';
  const seller = input.paymentMethod === 'stripe'
    ? 'HK REACH SOURCING LIMITED'
    : 'Quanzhou Reach Technology Co., Ltd.';

  await sendEmail({
    to: recipient,
    bcc: customerEmail ? businessEmail : undefined,
    replyTo: businessEmail,
    subject: `REACH PROJECTOR order confirmation ${input.orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#0f172a">
        <h1 style="font-size:22px">Payment received</h1>
        <p>Thank you for your order. We have received your payment and will contact you with fulfillment details.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Order</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(input.orderId)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Product</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(input.productName)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Quantity</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${input.quantity}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Paid</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(input.currency)} ${escapeHtml(input.amount)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Payment method</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${method}</td></tr>
          ${input.shippingMethod ? `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Shipping</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(input.shippingMethod)}</td></tr>` : ''}
          ${input.shippingAddress ? `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Delivery address</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;white-space:pre-line">${escapeHtml(input.shippingAddress)}</td></tr>` : ''}
          <tr><td style="padding:8px">Seller</td><td style="padding:8px">${seller}</td></tr>
        </table>
        <p>Questions? Reply to this email or contact ${businessEmail}.</p>
      </div>
    `,
  });
}

interface ShippingNotificationInput {
  orderId: string;
  productName: string;
  customerEmail: string | null;
  shippingMethod: string;
  trackingNumber: string;
}

export async function sendShippingNotification(input: ShippingNotificationInput): Promise<void> {
  if (!validEmail(input.customerEmail)) return;
  await sendEmail({
    to: input.customerEmail,
    bcc: 'info@reachtronics.com',
    replyTo: 'info@reachtronics.com',
    subject: `REACH PROJECTOR order shipped ${input.orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#0f172a">
        <h1 style="font-size:22px">Your order has shipped</h1>
        <p>Your ${escapeHtml(input.productName)} order is on its way.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Order</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(input.orderId)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">Shipping method</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${escapeHtml(input.shippingMethod)}</td></tr>
          <tr><td style="padding:8px">Tracking number</td><td style="padding:8px">${escapeHtml(input.trackingNumber)}</td></tr>
        </table>
        <p>Use the carrier's official tracking website or reply to this email if you need assistance.</p>
      </div>
    `,
  });
}
