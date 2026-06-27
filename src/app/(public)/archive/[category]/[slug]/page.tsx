import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Download, Share2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PdfViewerLazy } from "@/components/shared/pdf-viewer-lazy";
import { ArchiveCard } from "@/components/archive/archive-card";
import { JsonLd } from "@/components/shared/json-ld";

export const revalidate = 300;

type Attachment = { url: string; type: "pdf" | "image"; label?: string };

async function getArchiveItem(slug: string) {
  return prisma.archive.findUnique({ where: { slug }, include: { category: true } });
}

export async function generateStaticParams() {
  const archives = await prisma.archive.findMany({
    select: { slug: true, category: { select: { slug: true } } },
  });
  return archives.map((a) => ({ category: a.category.slug, slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArchiveItem(slug);
  if (!item) return {};
  return { title: item.metaTitle ?? item.title, description: item.metaDescription ?? item.content ?? undefined };
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const item = await getArchiveItem(slug);
  if (!item) notFound();

  const attachments = (item.attachments ?? []) as unknown as Attachment[];

  const related = await prisma.archive.findMany({
    where: { slug: { not: slug }, categoryId: item.categoryId },
    include: { category: true },
    take: 4,
  });

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description: item.content ?? undefined,
          datePublished: String(item.year),
          dateModified: item.updatedAt.toISOString(),
          author: { "@type": "Person", name: "ReportersMind" },
          publisher: item.publication
            ? { "@type": "Organization", name: item.publication }
            : undefined,
          url: `${SITE_URL}/archive/${item.category.slug}/${item.slug}`,
        }}
      />
      <article className="py-16">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{item.category.name}</Badge>
              <span className="text-muted-foreground text-sm">{item.year}</span>
              {item.publication ? <span className="text-muted-foreground text-sm">· {item.publication}</span> : null}
            </div>
            <h1 className="font-display mt-4 text-balance text-4xl sm:text-5xl">{item.title}</h1>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="size-3.5" /> Share
              </Button>
              {attachments[0] ? (
                <Button variant="outline" size="sm" render={<a href={attachments[0].url} download />}>
                  <Download className="size-3.5" /> Download
                </Button>
              ) : null}
            </div>
          </Reveal>

          {item.content ? (
            <Reveal delay={0.1}>
              <p className="text-foreground/90 mt-8 text-base leading-relaxed whitespace-pre-line">{item.content}</p>
            </Reveal>
          ) : null}

          {attachments.length > 0 ? (
            <Reveal delay={0.15}>
              <div className="mt-10 space-y-8">
                {attachments.map((att, idx) =>
                  att.type === "pdf" ? (
                    <PdfViewerLazy key={idx} url={att.url} />
                  ) : (
                    <div
                      key={idx}
                      className="bg-secondary/40 relative aspect-[4/3] overflow-hidden rounded-lg border border-border/60"
                    >
                      <Image src={att.url} alt={att.label ?? item.title} fill unoptimized className="object-contain" />
                    </div>
                  ),
                )}
              </div>
            </Reveal>
          ) : null}

          {item.tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="bg-secondary/30 py-16">
          <Container>
            <h2 className="font-display text-2xl">Related Archives</h2>
            <Separator className="my-8" />
            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <RevealItem key={r.slug}>
                  <ArchiveCard archive={r} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}
    </>
  );
}
