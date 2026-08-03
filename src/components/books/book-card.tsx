import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type BookCardData = {
  slug: string;
  title: string;
  subtitle?: string | null;
  coverImage: string;
  publishedYear?: number | null;
  category?: string | null;
  avgRating?: number | null;
  purchaseLinks?: unknown;
};

const FALLBACK_BUY_LINKS: Record<string, string> = {
  "with-love-sir": "https://www.amazon.in/Love-Sir-Sanjay-Mohan-Johri/dp/9357041184",
  "with-ove-sir": "https://www.amazon.in/Love-Sir-Sanjay-Mohan-Johri/dp/9357041184",
  "turning-point": "https://www.amazon.in/Turning-Point-Hindi-Sanjay-Mohan-ebook/dp/B09FL761GF/ref=sr_1_4?dib=eyJ2IjoiMSJ9.e6KLW9ix_PpDggN9_rEo3yKRMr3-uua3H2nw2bQKaGs.P0SZPHqENUDxkzxiC1L5JbRVValeVrfi8b41Wn6_bgw&dib_tag=se&qid=1783918966&refinements=p_27%3ADr.+Sanjay+Mohan+Johri&s=books&sr=1-4",
  "corona-bhaiya-mere-sapne-mein": "https://www.amazon.com/Corona-Bhaiya-Mere-Sapne-Hindi-ebook/dp/B0B4W98J7C",
  "corona-bhaiya": "https://www.amazon.com/Corona-Bhaiya-Mere-Sapne-Hindi-ebook/dp/B0B4W98J7C",
};

export function BookCard({ book }: { book: BookCardData }) {
  const purchaseObj = (book.purchaseLinks ?? {}) as Record<string, string>;
  const buyUrl =
    purchaseObj.amazon ||
    purchaseObj.buy ||
    FALLBACK_BUY_LINKS[book.slug] ||
    (typeof book.purchaseLinks === "string" ? book.purchaseLinks : null);

  return (
    <div className="group flex flex-col justify-between h-full rounded-xl border border-border/60 bg-card/60 p-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border">
      <div>
        <Link href={`/books/${book.slug}`} className="block">
          <div className="bg-secondary/30 relative h-[250px] sm:h-[270px] w-full overflow-hidden rounded-lg border border-border/60 flex items-center justify-center p-2">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              unoptimized
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 280px, 45vw"
            />
            {book.category ? (
              <Badge className="absolute top-2.5 left-2.5 z-10" variant="secondary">
                {book.category}
              </Badge>
            ) : null}
          </div>
          <div className="mt-3">
            <h3 className="font-display text-base sm:text-lg leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {book.title}
            </h3>
            {book.subtitle ? (
              <p className="text-muted-foreground mt-0.5 text-xs line-clamp-1">{book.subtitle}</p>
            ) : null}
            <div className="text-muted-foreground mt-1.5 flex items-center gap-3 text-xs">
              {book.publishedYear ? <span>{book.publishedYear}</span> : null}
              {book.avgRating ? (
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-current text-amber-500" />
                  {book.avgRating.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs" render={<Link href={`/books/${book.slug}`} />}>
          Details
        </Button>
        {buyUrl ? (
          <Button
            size="sm"
            className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1"
            render={
              <a
                href={buyUrl}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <ShoppingCart className="size-3.5" /> Buy Now
          </Button>
        ) : null}
      </div>
    </div>
  );
}
