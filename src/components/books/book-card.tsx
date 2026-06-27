import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type BookCardData = {
  slug: string;
  title: string;
  subtitle?: string | null;
  coverImage: string;
  publishedYear?: number | null;
  category?: string | null;
  avgRating?: number | null;
};

export function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <div className="bg-secondary/40 relative aspect-[3/4] overflow-hidden rounded-lg border border-border/60 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 280px, 45vw"
        />
        {book.category ? (
          <Badge className="absolute top-3 left-3" variant="secondary">
            {book.category}
          </Badge>
        ) : null}
      </div>
      <div className="mt-4">
        <h3 className="font-display text-lg leading-snug">{book.title}</h3>
        {book.subtitle ? <p className="text-muted-foreground mt-1 text-sm">{book.subtitle}</p> : null}
        <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
          {book.publishedYear ? <span>{book.publishedYear}</span> : null}
          {book.avgRating ? (
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-current" />
              {book.avgRating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
