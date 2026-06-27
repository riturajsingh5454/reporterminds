import type { Metadata } from "next";
import Link from "next/link";
import { getArchiveList } from "@/lib/archive-queries";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ArchiveCard } from "@/components/archive/archive-card";
import { PagePagination } from "@/components/shared/page-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Journalism Archive" };
export const revalidate = 300;

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; year?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { items, page, totalPages, categories, years } = await getArchiveList("JOURNALISM", params);

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set("category", params.category);
    if (params.year) sp.set("year", params.year);
    if (params.q) sp.set("q", params.q);
    sp.set("page", String(p));
    return `/archive?${sp.toString()}`;
  };

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Digital Knowledge Repository"
          title="Journalism Archive"
          description="Three decades of reporting on politics, environment, health, science, and society — searchable, year by year."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-sm">No archive entries found.</p>
            ) : (
              <RevealGroup className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <RevealItem key={item.slug}>
                    <ArchiveCard archive={item} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
            <PagePagination page={page} totalPages={totalPages} buildHref={buildHref} />
          </div>

          <aside className="space-y-8">
            <form action="/archive" className="space-y-2">
              <label className="text-xs font-semibold tracking-wide uppercase">Search</label>
              <Input name="q" defaultValue={params.q} placeholder="Search the archive…" />
            </form>

            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase">Category</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/archive">
                  <Badge variant={!params.category ? "default" : "outline"}>All</Badge>
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/archive?category=${cat.slug}`}>
                    <Badge variant={params.category === cat.slug ? "default" : "outline"}>{cat.name}</Badge>
                  </Link>
                ))}
              </div>
            </div>

            {years.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold tracking-wide uppercase">Year</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/archive">
                    <Badge variant={!params.year ? "default" : "outline"}>All</Badge>
                  </Link>
                  {years.map((year) => (
                    <Link key={year} href={`/archive?year=${year}`}>
                      <Badge variant={params.year === String(year) ? "default" : "outline"}>{year}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </section>
  );
}
