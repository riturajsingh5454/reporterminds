import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { BookCard } from "@/components/books/book-card";

export const metadata: Metadata = { title: "Books" };
export const revalidate = 300;

export default async function BooksPage() {
  const books = await safeQuery(
    () =>
      prisma.book.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ isFeatured: "desc" }, { publishedYear: "desc" }],
        include: { reviews: true },
      }),
    [],
  );

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Author Platform"
          title="Books"
          description="Long-form journalism and storytelling, collected across two decades."
        />

        {books.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">No books published yet.</p>
        ) : (
          <RevealGroup className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => {
              const avgRating =
                book.reviews.length > 0
                  ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
                  : null;
              return (
                <RevealItem key={book.slug}>
                  <BookCard book={{ ...book, avgRating }} />
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </Container>
    </section>
  );
}
