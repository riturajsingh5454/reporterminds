import type { Metadata } from "next";
import Link from "next/link";
import { prisma, safeQuery } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Photo Gallery" };
export const revalidate = 300;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const [categories, items] = await Promise.all([
    safeQuery(() => prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }), []),
    safeQuery(
      () =>
        prisma.gallery.findMany({
          where: categorySlug ? { category: { slug: categorySlug } } : {},
          orderBy: { order: "asc" },
        }),
      [],
    ),
  ]);


  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Media Library"
          title="Photo Gallery"
          description={`"A picture is worth a thousand words" as it captures emotions, tells stories, and conveys messages that words often cannot. Visuals transcend language barriers, evoking instant connections and deep understanding. This section will carry Clicks taken by me or from friends with due credit.`}
        />

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/gallery">
            <Badge variant={!categorySlug ? "default" : "outline"}>All</Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/gallery?category=${cat.slug}`}>
              <Badge variant={categorySlug === cat.slug ? "default" : "outline"}>{cat.name}</Badge>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <GalleryGrid items={items} />
        </div>
      </Container>
    </section>
  );
}
