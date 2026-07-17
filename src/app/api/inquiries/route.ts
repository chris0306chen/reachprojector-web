import { NextResponse } from 'next/server';
import { createInquiry } from '@/lib/data-service';
import { sendEmail } from '@/lib/email';

function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject?: string;
  inquiry_type?: string;
}) {
  const toAddress = 'info@reachtronics.com';
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F172A; border-bottom: 2px solid #F97316; padding-bottom: 8px;">
        New Inquiry from ${inquiry.name}
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; width: 120px; border: 1px solid #e2e8f0;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
            <a href="mailto:${inquiry.email}" style="color: #F97316;">${inquiry.email}</a>
          </td>
        </tr>
        ${inquiry.company ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Company</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${inquiry.company}</td>
        </tr>
        ` : ''}
        ${inquiry.subject ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Subject</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${inquiry.subject}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Type</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${inquiry.inquiry_type || 'general'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Time</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${now}</td>
        </tr>
      </table>
      <div style="margin: 16px 0;">
        <h3 style="color: #0F172A; margin-bottom: 8px;">Message</h3>
        <div style="padding: 12px 16px; background: #f8fafc; border-left: 3px solid #F97316; border-radius: 4px; white-space: pre-wrap;">
${inquiry.message}
        </div>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        Sent from REACH PROJECTOR Contact Form
      </p>
    </div>
  `;

  return sendEmail({
    to: toAddress,
    subject: `New Inquiry: ${inquiry.subject || inquiry.name}`,
    html,
    replyTo: inquiry.email,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message, subject, inquiry_type } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry({
      name,
      email,
      company,
      message,
      subject,
      inquiry_type,
    });

    // Send email notification (fire and forget - don't fail inquiry if email fails)
    sendInquiryNotification({ name, email, company, message, subject, inquiry_type })
      .catch((err) => console.error('Email notification failed:', err));

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
