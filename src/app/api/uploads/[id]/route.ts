import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const buffer = Buffer.from(upload.data, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }
}
