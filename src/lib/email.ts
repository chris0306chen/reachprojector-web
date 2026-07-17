// Email service using Resend REST API
// Docs: https://resend.com/docs

const RESEND_API_URL = 'https://api.resend.com/emails';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface SendEmailResult {
  id: string;
  success: boolean;
}

/**
 * Send an email via Resend REST API.
 * Reads RESEND_API_KEY from environment variables.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  const fromAddress = options.from || 'info@reachtronics.com';

  const payload: Record<string, unknown> = {
    from: fromAddress,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
  };

  if (options.replyTo) payload.reply_to = options.replyTo;
  if (options.cc) payload.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
  if (options.bcc) payload.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return { id: data.id, success: true };
}
