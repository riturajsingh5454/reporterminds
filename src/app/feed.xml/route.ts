import { prisma, safeQuery } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [articles, settings] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: 30,
        }),
      [],
    ),
    safeQuery(() => prisma.siteSettings.findFirst(), null),
  ]);

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/blog/${a.slug}</link>
      <guid>${SITE_URL}/blog/${a.slug}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${(a.publishedAt ?? a.createdAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(settings?.siteName ?? "ReportersMind")}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(settings?.tagline ?? "Journalism, books, and essays.")}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
