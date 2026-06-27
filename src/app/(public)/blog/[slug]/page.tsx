import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { Container } from "@/components/shared/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArticleCard } from "@/components/blog/article-card";
import { JsonLd } from "@/components/shared/json-ld";

export const revalidate = 120;

async function getArticle(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: true, tags: true, author: true },
  });
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    openGraph: { images: [article.ogImage ?? article.coverImage] },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || article.status !== "PUBLISHED") notFound();

  const relatedArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: slug },
      ...(article.categoryId ? { categoryId: article.categoryId } : {}),
    },
    include: { category: true },
    take: 3,
  });

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          image: article.coverImage,
          datePublished: article.publishedAt?.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          author: { "@type": "Person", name: article.author?.name ?? "ReportersMind" },
        }}
      />
      <article className="py-16">
        <Container className="max-w-3xl">
          <Reveal>
            {article.category ? (
              <Link href={`/blog/category/${article.category.slug}`}>
                <Badge variant="secondary" className="mb-4">
                  {article.category.name}
                </Badge>
              </Link>
            ) : null}
            <h1 className="font-display text-balance text-4xl sm:text-5xl">{article.title}</h1>
            <div className="text-muted-foreground mt-4 flex items-center gap-3 text-sm">
              {article.author?.name ? <span>{article.author.name}</span> : null}
              {date ? <span>{date}</span> : null}
              <span>{article.readTimeMins} min read</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-secondary/40 relative mt-8 aspect-video overflow-hidden rounded-xl border border-border/60">
              <Image src={article.coverImage} alt={article.title} fill unoptimized className="object-cover" />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className="prose-neutral mt-10 max-w-none text-base leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-2xl [&_img]:rounded-lg [&_p]:my-4"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.contentHtml) }}
            />
          </Reveal>

          {article.tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
                  <Badge variant="outline">#{tag.name}</Badge>
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </article>

      {relatedArticles.length > 0 ? (
        <section className="bg-secondary/30 py-16">
          <Container>
            <h2 className="font-display text-2xl">Related Articles</h2>
            <Separator className="my-8" />
            <RevealGroup className="grid gap-8 sm:grid-cols-3">
              {relatedArticles.map((a) => (
                <RevealItem key={a.slug}>
                  <ArticleCard article={a} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}
    </>
  );
}
