import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALLOWED_UPLOAD_TYPES } from "@/lib/upload";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const upload = await prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Never serve a stored type that is not on the allowlist (e.g. legacy SVG/HTML uploads).
    const isAllowed = (ALLOWED_UPLOAD_TYPES as readonly string[]).includes(upload.mimeType);
    const contentType = isAllowed ? upload.mimeType : "application/octet-stream";

    const buffer = Buffer.from(upload.data, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Content-Disposition": isAllowed ? "inline" : "attachment",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }
}
