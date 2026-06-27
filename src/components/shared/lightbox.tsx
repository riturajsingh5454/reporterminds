"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Dialog, DialogPortal, DialogOverlay, DialogClose } from "@/components/ui/dialog";

export type LightboxImage = { src: string; alt: string };

export function Lightbox({
  images,
  trigger,
}: {
  images: LightboxImage[];
  trigger: (openAt: (index: number) => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      {trigger(show)}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/90" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="relative aspect-[4/3] w-full max-w-4xl">
              <Image
                src={images[index]?.src ?? ""}
                alt={images[index]?.alt ?? ""}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <DialogClose className="absolute top-6 right-6 text-white/80 hover:text-white">
              <X className="size-6" />
            </DialogClose>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-8" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % images.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-8" />
                </button>
              </>
            ) : null}
          </div>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export function ZoomHint() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity duration-300 group-hover:bg-black/20 group-hover:opacity-100">
      <ZoomIn className="size-6 text-white" />
    </div>
  );
}
