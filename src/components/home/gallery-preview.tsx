import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export type GalleryPreviewItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
};

export function GalleryPreview({ items }: { items: GalleryPreviewItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Media Library" title="Moments Captured" description="A visual journal across journalism, events, and travel." />
          <Button variant="outline" render={<Link href="/gallery" />}>
            Full Gallery <ArrowRight className="size-4" />
          </Button>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item, idx) => (
            <RevealItem
              key={item.id}
              className={idx % 5 === 0 ? "col-span-2 row-span-2" : ""}
            >
              <Link
                href="/gallery"
                className={`bg-secondary/40 relative block overflow-hidden rounded-lg border border-border/60 ${
                  idx % 5 === 0 ? "aspect-square" : "aspect-square"
                }`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.caption ?? "Gallery image"}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(min-width: 1024px) 300px, 45vw"
                />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
