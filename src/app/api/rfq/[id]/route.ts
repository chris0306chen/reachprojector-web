import { NextRequest, NextResponse } from "next/server";
import { PUT as updateInquiry } from "@/app/api/admin/inquiries/route";

// Legacy clients must provide expected_version; ownership checks cannot be bypassed.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { notes, ...body } = await request.json();
    const url = new URL(request.url);
    url.searchParams.set("inquiry_type", "rfq");
    return updateInquiry(new NextRequest(url, {
      method: "PUT", headers: request.headers,
      body: JSON.stringify({ ...body, id, ...(notes !== undefined ? { reply: notes } : {}) }),
    }));
  } catch {
    return NextResponse.json({ error: "Invalid inquiry update" }, { status: 400 });
  }
}
