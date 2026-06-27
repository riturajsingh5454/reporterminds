import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PurchaseLinks } from "@/components/books/purchase-links";
import { ReviewCard } from "@/components/books/review-card";
import { BookCard } from "@/components/books/book-card";
import { JsonLd } from "@/components/shared/json-ld";

export const revalidate = 300;

async function getBook(slug: string) {
  return prisma.book.findUnique({ where: { slug }, include: { reviews: true } });
}

export async function generateStaticParams() {
  const books = await prisma.book.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return {};
  return {
    title: book.metaTitle ?? book.title,
    description: book.metaDescription ?? book.description,
    openGraph: { images: book.ogImage ? [book.ogImage] : [book.coverImage] },
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  const relatedBooks = await prisma.book.findMany({
    where: { status: "PUBLISHED", slug: { not: slug }, ...(book.category ? { category: book.category } : {}) },
    take: 4,
  });

  const avgRating =
    book.reviews.length > 0 ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          author: { "@type": "Person", name: "ReportersMind" },
          description: book.description,
          image: book.coverImage,
          isbn: book.isbn ?? undefined,
          datePublished: book.publishedYear ? String(book.publishedYear) : undefined,
          aggregateRating:
            avgRating && book.reviews.length > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: avgRating.toFixed(1),
                  reviewCount: book.reviews.length,
                }
              : undefined,
        }}
      />
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div className="bg-secondary/40 relative aspect-[3/4] overflow-hidden rounded-xl border border-border/60 shadow-sm">
                <Image src={book.coverImage} alt={book.title} fill unoptimized className="object-cover" />
              </div>
              {book.galleryImages.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {book.galleryImages.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="bg-secondary/40 relative aspect-square overflow-hidden rounded-md border border-border/60">
                      <Image src={img} alt={`${book.title} ${idx + 1}`} fill unoptimized className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </Reveal>

            <Reveal direction="right">
              {book.category ? <Badge variant="secondary">{book.category}</Badge> : null}
              <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl">{book.title}</h1>
              {book.subtitle ? <p className="text-muted-foreground mt-3 text-lg">{book.subtitle}</p> : null}

              <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
                {book.publishedYear ? <span>{book.publishedYear}</span> : null}
                {book.publisher ? <span>{book.publisher}</span> : null}
                {book.pages ? <span>{book.pages} pages</span> : null}
                {avgRating ? <span>★ {avgRating.toFixed(1)} ({book.reviews.length} reviews)</span> : null}
              </div>

              <p className="text-foreground/90 mt-6 text-base leading-relaxed">{book.description}</p>

              <div className="mt-8">
                <PurchaseLinks links={book.purchaseLinks} />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {book.reviews.length > 0 ? (
        <section className="bg-secondary/30 py-16">
          <Container>
            <h2 className="font-display text-2xl">Reviews</h2>
            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {book.reviews.map((review) => (
                <RevealItem key={review.id}>
                  <ReviewCard review={review} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}

      {relatedBooks.length > 0 ? (
        <section className="py-16">
          <Container>
            <h2 className="font-display text-2xl">Related Books</h2>
            <Separator className="my-8" />
            <RevealGroup className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {relatedBooks.map((b) => (
                <RevealItem key={b.slug}>
                  <BookCard book={b} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}
    </>
  );
}
