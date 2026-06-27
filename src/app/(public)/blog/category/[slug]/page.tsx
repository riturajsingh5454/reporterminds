import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ArticleCard } from "@/components/blog/article-card";
import { PagePagination } from "@/components/shared/page-pagination";

export const revalidate = 120;
const PAGE_SIZE = 9;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.articleCategory.findUnique({ where: { slug } });
  return { title: category ? `${category.name} Articles` : "Category" };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const category = await prisma.articleCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const where = { status: "PUBLISHED" as const, categoryId: category.id };
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Category" title={category.name} description={category.description ?? undefined} />

        {articles.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">No articles in this category yet.</p>
        ) : (
          <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <RevealItem key={article.slug}>
                <ArticleCard article={article} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <PagePagination page={page} totalPages={totalPages} buildHref={(p) => `/blog/category/${slug}?page=${p}`} />
      </Container>
    </section>
  );
}
