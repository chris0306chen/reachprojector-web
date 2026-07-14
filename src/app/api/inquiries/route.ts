import { NextResponse } from 'next/server';
import { createInquiry } from '@/lib/data-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message, inquiry_type } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      subject: subject || undefined,
      message,
      inquiry_type: inquiry_type || 'general',
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
