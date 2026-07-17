import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

/**
 * POST /api/admin/upload
 * Upload files to Supabase Storage
 *
 * Body: multipart/form-data with 'file' field
 * Query params:
 * - bucket: Storage bucket name (default: 'attachments')
 * - folder: Folder path within bucket (default: '')
 *
 * Returns: { url, path, size, type }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = request.nextUrl.searchParams.get("bucket") || "attachments";
    const folder = request.nextUrl.searchParams.get("folder") || "";

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

    const supabase = await getSupabaseClient();

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = folder ? `${folder}/${timestamp}_${sanitizedFilename}` : `${timestamp}_${sanitizedFilename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Upload failed", details: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/upload
 * List files in a bucket
 */
export async function GET(request: NextRequest) {
  try {
    const bucket = request.nextUrl.searchParams.get("bucket") || "attachments";
    const folder = request.nextUrl.searchParams.get("folder") || "";

    const supabase = await getSupabaseClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("List error:", error);
      return NextResponse.json(
        { error: "Failed to list files", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ files: data || [] });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
