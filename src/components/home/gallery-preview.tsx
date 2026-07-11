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
  eventName: string | null;
  location: string | null;
};

export function GalleryPreview({ items }: { items: GalleryPreviewItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Media Library" title="Moments Captured" description={`"A picture is worth a thousand words" as it captures emotions, tells stories, and conveys messages that words often cannot. Visuals transcend language barriers, evoking instant connections and deep understanding. This section will carry Clicks taken by me or from friends with due credit.`} />
          <Button variant="outline" render={<Link href="/gallery" />}>
            Full Gallery <ArrowRight className="size-4" />
          </Button>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item.id}>
              <Link
                href="/gallery"
                className="group bg-secondary/40 relative block overflow-hidden rounded-xl border border-border/60 aspect-[4/3]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.caption ?? "Gallery image"}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                {/* Hover overlay with details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption && (
                    <span className="text-sm font-semibold leading-tight">{item.caption}</span>
                  )}
                  {item.eventName && (
                    <span className="text-xs text-white/80">{item.eventName}</span>
                  )}
                  {item.location && (
                    <span className="text-xs text-white/60">{item.location}</span>
                  )}
                  {!item.caption && !item.eventName && !item.location && (
                    <span className="text-xs text-white/60">View in Gallery</span>
                  )}
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
