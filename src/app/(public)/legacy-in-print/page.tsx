import type { Metadata } from "next";
import Link from "next/link";
import { getArchiveList } from "@/lib/archive-queries";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ArchiveCard } from "@/components/archive/archive-card";
import { PagePagination } from "@/components/shared/page-pagination";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Legacy in Print" };
export const revalidate = 300;

export default async function LegacyInPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const { items, page, totalPages, categories } = await getArchiveList("LEGACY_PRINT", params);

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set("category", params.category);
    sp.set("page", String(p));
    return `/legacy-in-print?${sp.toString()}`;
  };

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Legacy Showcase"
          title="Legacy in Print"
          description="PTI dispatches, newspaper reports, Science Spectrum columns, and editorials — preserved in their original form."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/legacy-in-print">
            <Badge variant={!params.category ? "default" : "outline"}>All</Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/legacy-in-print?category=${cat.slug}`}>
              <Badge variant={params.category === cat.slug ? "default" : "outline"}>{cat.name}</Badge>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">No entries found in this category yet.</p>
        ) : (
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <RevealItem key={item.slug}>
                <ArchiveCard archive={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <PagePagination page={page} totalPages={totalPages} buildHref={buildHref} />
      </Container>
    </section>
  );
}
