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

    const inquiryData = {
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      company: company ? String(company) : undefined,
      subject: subject ? String(subject) : undefined,
      message: String(message),
      inquiry_type: inquiry_type ? String(inquiry_type) : 'general',
    } as const;

    const inquiry = await createInquiry(inquiryData as any);

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
