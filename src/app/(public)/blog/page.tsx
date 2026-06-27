import type { Metadata } from "next";
import Link from "next/link";
import { prisma, safeQuery } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ArticleCard } from "@/components/blog/article-card";
import { PagePagination } from "@/components/shared/page-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Writing" };
export const revalidate = 120;

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const { page: pageParam, category: categorySlug, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [articles, total, categories] = await Promise.all([
    safeQuery(
      () =>
        prisma.article.findMany({
          where,
          include: { category: true },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        }),
      [],
    ),
    safeQuery(() => prisma.article.count({ where }), 0),
    safeQuery(() => prisma.articleCategory.findMany({ orderBy: { name: "asc" } }), []),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `/blog?${params.toString()}`;
  };

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Latest Writing" title="Writing" description="Reporting, essays, and analysis." />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            {articles.length === 0 ? (
              <p className="text-muted-foreground text-sm">No articles found.</p>
            ) : (
              <RevealGroup className="grid gap-8 sm:grid-cols-2">
                {articles.map((article) => (
                  <RevealItem key={article.slug}>
                    <ArticleCard article={article} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
            <PagePagination page={page} totalPages={totalPages} buildHref={buildHref} />
          </div>

          <aside className="space-y-8">
            <form action="/blog" className="space-y-2">
              <label className="text-xs font-semibold tracking-wide uppercase">Search</label>
              <Input name="q" defaultValue={q} placeholder="Search articles…" />
            </form>

            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase">Categories</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/blog">
                  <Badge variant={!categorySlug ? "default" : "outline"}>All</Badge>
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/blog?category=${cat.slug}`}>
                    <Badge variant={categorySlug === cat.slug ? "default" : "outline"}>{cat.name}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
