import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken, SESSION_COOKIE_NAME } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Auth guard — same pattern as middleware
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifyAuthToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { subscribedAt: "desc" },
    select: { email: true, status: true, source: true, subscribedAt: true },
  });

  // Build CSV rows
  const header = "email,status,source,subscribedAt";
  const rows = subscribers.map((s) => {
    const date = s.subscribedAt.toISOString().split("T")[0];
    return `${s.email},${s.status},${s.source ?? ""},${date}`;
  });
  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-subscribers-${Date.now()}.csv"`,
    },
  });
}
