import { NextRequest, NextResponse } from "next/server";
import { getActiveShippingCountries, getShippingQuote } from "@/lib/shipping";

const manualQuote = (reason: string, status = 200) =>
  NextResponse.json({ mode: "manual_quote", reason }, { status });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = typeof body.productId === "string" ? body.productId.trim() : "";
    const countryCode = typeof body.countryCode === "string" ? body.countryCode.trim().toUpperCase() : "";
    const quantity = Number(body.quantity);

    if (!productId || !/^[A-Z]{2}$/.test(countryCode) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return manualQuote("INVALID_REQUEST", 400);
    }

    const quote = await getShippingQuote(productId, countryCode, quantity);
    if (quote.mode === "manual_quote") return manualQuote(quote.reason);
    return NextResponse.json(quote);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (["42P01", "42703"].includes(code)) return manualQuote("SHIPPING_SETUP_PENDING");
    console.error("Shipping quote failed:", error);
    return manualQuote("QUOTE_UNAVAILABLE", 500);
  }
}

export async function GET() {
  try {
    return NextResponse.json({ countries: await getActiveShippingCountries() });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (["42P01", "42703"].includes(code)) return NextResponse.json({ countries: [] });
    console.error("Shipping countries failed:", error);
    return NextResponse.json({ countries: [] }, { status: 500 });
  }
}
