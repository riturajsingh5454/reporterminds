import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { BookCard, type BookCardData } from "@/components/books/book-card";

export function FeaturedBooks({ books }: { books: BookCardData[] }) {
  if (books.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Author Platform" title="Featured Books" description="Long-form work, available now." />
          <Button variant="outline" render={<Link href="/books" />}>
            View All Books <ArrowRight className="size-4" />
          </Button>
        </div>

        <Carousel className="mt-12" opts={{ align: "start" }}>
          <CarouselContent>
            {books.map((book) => (
              <CarouselItem key={book.slug} className="sm:basis-1/2 lg:basis-1/3">
                <BookCard book={book} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </section>
  );
}
