import { NextRequest, NextResponse } from "next/server";

interface ScrapeResult {
  taskId: string;
  status: "pending" | "completed" | "failed";
  url: string;
  data?: {
    title: string;
    titleZh?: string;
    images: string[];
    description: string;
    specifications: Record<string, string>;
    price?: string;
    brand?: string;
  };
  error?: string;
}

// In-memory task store (in production, use Redis or database)
const taskStore = new Map<string, ScrapeResult>();

function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function extractMetaContent(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return "";
}

function extractTitle(html: string): string {
  const ogTitle = extractMetaContent(html, "og:title");
  if (ogTitle) return ogTitle;
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractDescription(html: string): string {
  const ogDesc = extractMetaContent(html, "og:description");
  if (ogDesc) return ogDesc;
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return match ? match[1] : "";
}

function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  // Try og:image first
  const ogImages = html.matchAll(/<meta[^>]*(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["']/gi);
  for (const match of ogImages) {
    images.push(match[1]);
  }
  // If no og:image, try to find product images
  if (images.length === 0) {
    const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["'][^>]*>/gi);
    for (const match of imgMatches) {
      let src = match[1];
      if (src.startsWith("//")) src = "https:" + src;
      else if (src.startsWith("/")) {
        try {
          const url = new URL(baseUrl);
          src = url.origin + src;
        } catch { /* skip */ }
      }
      if (!src.includes("logo") && !src.includes("icon") && !src.includes("sprite")) {
        images.push(src);
      }
      if (images.length >= 5) break;
    }
  }
  return [...new Set(images)].slice(0, 10);
}

async function scrapeUrl(url: string): Promise<ScrapeResult["data"]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const title = extractTitle(html);
  const description = extractDescription(html);
  const images = extractImages(html, url);

  // Try to extract price from common patterns
  const priceMatch = html.match(/[$¥€£]\s*[\d,]+\.?\d*/);
  const price = priceMatch ? priceMatch[0] : undefined;

  return {
    title: title || "Unknown Product",
    images,
    description: description || "",
    specifications: {},
    price,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const taskId = generateTaskId();
    taskStore.set(taskId, { taskId, status: "pending", url });

    // Start scraping in background
    scrapeUrl(url)
      .then((data) => {
        taskStore.set(taskId, { taskId, status: "completed", url, data });
      })
      .catch((err) => {
        taskStore.set(taskId, { taskId, status: "failed", url, error: err.message });
      });

    return NextResponse.json({ taskId, status: "pending" }, { status: 202 });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Failed to start import" }, { status: 500 });
  }
}
