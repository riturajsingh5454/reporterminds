"use client";

import Image from "next/image";
import { Lightbox, type LightboxImage } from "@/components/shared/lightbox";

export type GalleryGridItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
};

export function GalleryGrid({ items }: { items: GalleryGridItem[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No photos in this category yet.</p>;
  }

  const images: LightboxImage[] = items.map((item) => ({ src: item.imageUrl, alt: item.caption ?? "Gallery image" }));

  return (
    <Lightbox
      images={images}
      trigger={(openAt) => (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {items.map((item, idx) => (
            <GalleryTile key={item.id} item={item} onClick={() => openAt(idx)} />
          ))}
        </div>
      )}
    />
  );
}

function GalleryTile({ item, onClick }: { item: GalleryGridItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-secondary/40 relative block w-full overflow-hidden rounded-lg border border-border/60"
    >
      <Image
        src={item.imageUrl}
        alt={item.caption ?? "Gallery image"}
        width={400}
        height={400}
        unoptimized
        className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {item.caption ? (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {item.caption}
        </span>
      ) : null}
    </button>
  );
}
