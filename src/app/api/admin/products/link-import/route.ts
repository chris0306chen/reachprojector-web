import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { collectProductLink } from "@/lib/product-link-import";

export const runtime = "nodejs";

const requestSchema = z.object({ url: z.string().url().max(2048) });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, "products")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid product URL" }, { status: 400 });

  try {
    return NextResponse.json({ data: await collectProductLink(parsed.data.url) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to collect this product page";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
