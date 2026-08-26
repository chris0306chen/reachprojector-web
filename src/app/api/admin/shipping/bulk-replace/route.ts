import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { normalizeShippingTemplate } from "@/lib/shipping-template";

const MAX_TEMPLATES = 500;

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseClient();
  let previousIds: string[] = [];
  let insertedIds: string[] = [];

  try {
    const body = await request.json();
    const batchId = String(body.batch_id || "").trim();
    const countries: string[] = [...new Set<string>(
      (Array.isArray(body.replace_countries) ? body.replace_countries : [])
        .map((value: unknown) => String(value).trim().toUpperCase())
    )];
    const input = Array.isArray(body.templates) ? body.templates : [];

    if (!batchId || !countries.length || input.length < 1 || input.length > MAX_TEMPLATES) {
      return NextResponse.json({ error: "Invalid bulk replacement payload" }, { status: 400 });
    }
    if (countries.some((code) => !/^[A-Z]{2}$/.test(code))) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
    }

    const normalized = input.map((item: Record<string, unknown>) => {
      const active = normalizeShippingTemplate({ ...item, is_active: true });
      if (!countries.includes(String(active.country_code))) throw new Error("INVALID_COUNTRY_SCOPE");
      return {
        ...active,
        is_active: false,
        notes: `[batch:${batchId}] ${String(active.notes || "")}`.trim(),
      };
    });

    const termByCountry = new Map<string, Set<string>>();
    for (const row of normalized) {
      const code = String(row.country_code);
      const terms = termByCountry.get(code) || new Set<string>();
      terms.add(String(row.trade_terms));
      termByCountry.set(code, terms);
    }
    if (countries.some((code) => !termByCountry.has(code) || termByCountry.get(code)!.size !== 1)) {
      return NextResponse.json({ error: "Each country must have exactly one trade term" }, { status: 400 });
    }

    const { data: previous, error: previousError } = await supabase
      .from("shipping_templates")
      .select("id")
      .in("country_code", countries)
      .eq("is_active", true);
    if (previousError) throw previousError;
    previousIds = (previous || []).map((row) => String(row.id));

    const { data: inserted, error: insertError } = await supabase
      .from("shipping_templates")
      .insert(normalized)
      .select("id");
    if (insertError) throw insertError;
    insertedIds = (inserted || []).map((row) => String(row.id));
    if (insertedIds.length !== normalized.length) throw new Error("INCOMPLETE_INSERT");

    if (previousIds.length) {
      const { error: deactivateError } = await supabase
        .from("shipping_templates")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .in("id", previousIds);
      if (deactivateError) throw deactivateError;
    }

    const { error: activateError } = await supabase
      .from("shipping_templates")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .in("id", insertedIds);
    if (activateError) throw activateError;

    return NextResponse.json({
      success: true,
      data: { batchId, countries: countries.length, inserted: insertedIds.length, replaced: previousIds.length },
    });
  } catch (error) {
    if (previousIds.length) {
      await supabase.from("shipping_templates").update({ is_active: true }).in("id", previousIds);
    }
    if (insertedIds.length) {
      await supabase.from("shipping_templates").update({ is_active: false }).in("id", insertedIds);
    }
    console.error("Failed to bulk replace shipping templates:", error);
    const invalid = error instanceof Error && error.message.startsWith("INVALID_");
    return NextResponse.json(
      { error: invalid ? "Invalid shipping rule" : "Failed to replace shipping templates" },
      { status: invalid ? 400 : 500 }
    );
  }
}
