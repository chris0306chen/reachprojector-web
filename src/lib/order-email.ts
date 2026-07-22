import { sendEmail } from '@/lib/email';

interface OrderConfirmationInput {
  orderId: string;
  productName: string;
  quantity: number;
  amount: string;
  currency: string;
  customerEmail: string | null;
  paymentMethod: 'paypal' | 'stripe';
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
          <tr><td style="padding:8px">Payment method</td><td style="padding:8px">${method}</td></tr>
        </table>
        <p>Questions? Reply to this email or contact ${businessEmail}.</p>
      </div>
    `,
  });
}
