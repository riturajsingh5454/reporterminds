import { NextRequest } from "next/server";

export const maxDuration = 60;

function extractDriveId(url: string): string | null {
  return url.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.match(/[?&]id=([^&]+)/)?.[1] ?? null;
}

async function resolveDownloadUrl(id: string): Promise<string> {
  const directUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  const probe = await fetch(directUrl, { redirect: "follow" });
  const contentType = probe.headers.get("content-type") ?? "";

  if (!contentType.includes("text/html")) {
    return directUrl;
  }

  const html = await probe.text();
  const action = html
    .match(/action="(https:\/\/drive\.usercontent\.google\.com\/download[^"]*)"/)?.[1]
    ?.replace(/&amp;/g, "&");
  if (!action) throw new Error("Could not resolve Drive download link");

  const params = new URLSearchParams();
  for (const [, name, value] of html.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]*)">/g)) {
    params.set(name, value);
  }
  if (!params.has("confirm")) params.set("confirm", "t");

  return `${action}?${params.toString()}`;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !url.includes("drive.google.com")) {
    return new Response("Invalid url", { status: 400 });
  }

  const id = extractDriveId(url);
  if (!id) {
    return new Response("Invalid Drive URL", { status: 400 });
  }

  try {
    const downloadUrl = await resolveDownloadUrl(id);
    const upstream = await fetch(downloadUrl, { redirect: "follow" });

    if (!upstream.ok || !upstream.body) {
      return new Response("Failed to fetch file", { status: 502 });
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") ?? "application/pdf");
    const length = upstream.headers.get("content-length");
    if (length) headers.set("Content-Length", length);
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(upstream.body, { status: 200, headers });
  } catch {
    return new Response("Failed to fetch file", { status: 502 });
  }
}
