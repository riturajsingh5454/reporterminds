import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, UnauthorizedError, ForbiddenError } from "@/lib/rbac";
import { toCsvRow } from "@/lib/csv";

export async function GET() {
  try {
    await requireRole("ADMIN");
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof UnauthorizedError ? 401 : 403 });
    }
    throw error;
  }

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { subscribedAt: "desc" },
    select: { email: true, status: true, source: true, subscribedAt: true },
  });

  const rows = subscribers.map((s) =>
    toCsvRow([s.email, s.status, s.source ?? "", s.subscribedAt.toISOString().split("T")[0]]),
  );
  const csv = [toCsvRow(["email", "status", "source", "subscribedAt"]), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-subscribers-${Date.now()}.csv"`,
    },
  });
}
