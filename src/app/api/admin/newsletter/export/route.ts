import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, UnauthorizedError, ForbiddenError } from "@/lib/rbac";

export async function GET() {
  try {
    await requireRole("ADMIN");
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof UnauthorizedError ? 401 : 403 });
    }
    throw error;
  }

  const subscribers = await prisma.newsletter.findMany({ orderBy: { subscribedAt: "desc" } });

  const header = "email,status,source,subscribedAt";
  const rows = subscribers.map((s) =>
    [s.email, s.status, s.source ?? "", s.subscribedAt.toISOString()].map((v) => `"${v.replace(/"/g, '""')}"`).join(","),
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="newsletter-subscribers.csv"`,
    },
  });
}
