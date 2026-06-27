import type { Metadata } from "next";
import Link from "next/link";
import { prisma, safeQuery } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = { title: "Testimonials" };
export const revalidate = 300;

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: "STUDENT" | "PROFESSIONAL" }>;
}) {
  const { category } = await searchParams;

  const testimonials = await safeQuery(
    () =>
      prisma.testimonial.findMany({
        where: category ? { category } : {},
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      }),
    [],
  );


  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Testimonials — ReportersMind",
          itemListElement: testimonials.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Review",
              reviewBody: t.content,
              author: { "@type": "Person", name: t.authorName },
              ...(t.rating ? { reviewRating: { "@type": "Rating", ratingValue: t.rating } } : {}),
            },
          })),
        }}
      />
      <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Voices"
          title="Testimonials"
          description="What students, colleagues, and collaborators have to say."
          align="center"
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Link href="/testimonials">
            <Badge variant={!category ? "default" : "outline"}>All</Badge>
          </Link>
          <Link href="/testimonials?category=STUDENT">
            <Badge variant={category === "STUDENT" ? "default" : "outline"}>Student</Badge>
          </Link>
          <Link href="/testimonials?category=PROFESSIONAL">
            <Badge variant={category === "PROFESSIONAL" ? "default" : "outline"}>Professional</Badge>
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-center text-sm">No testimonials yet.</p>
        ) : (
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <RevealItem key={t.id}>
                <TestimonialCard testimonial={t} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Container>
    </section>
    </>
  );
}
