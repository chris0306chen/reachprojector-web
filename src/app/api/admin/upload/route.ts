import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentUser, hasPermission } from "@/lib/auth";

/**
 * POST /api/admin/upload
 * Upload files to Supabase Storage "attachments" bucket
 *
 * Body: multipart/form-data with 'file' field
 * File path: uploads/{timestamp}_{filename}
 *
 * Returns: { url: string, name: string, size: number }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, "products")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const kind = formData.get("kind");
    const requestedName = formData.get("storageName");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }
    if (
      kind === "product-image" &&
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
    ) {
      return NextResponse.json(
        { error: "Product images must be JPG, PNG, WebP or AVIF" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();
    const bucket = "attachments";

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucket);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      });
    }

    // Generate file path: uploads/{timestamp}_{filename}
    const timestamp = Date.now();
    const candidateName = typeof requestedName === "string" && requestedName ? requestedName : file.name;
    const safeName = candidateName.toLowerCase().replace(/[^a-z0-9._-]/g, "-").slice(0, 255);
    const storagePath = `products/${timestamp}-${safeName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed", details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
