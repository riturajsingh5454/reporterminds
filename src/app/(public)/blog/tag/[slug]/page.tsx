import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ArticleCard } from "@/components/blog/article-card";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  return { title: tag ? `#${tag.name}` : "Tag" };
}

export default async function BlogTagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", tagIds: { has: tag.id } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Tag" title={`#${tag.name}`} />

        {articles.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">No articles tagged &ldquo;{tag.name}&rdquo; yet.</p>
        ) : (
          <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <RevealItem key={article.slug}>
                <ArticleCard article={article} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Container>
    </section>
  );
}
