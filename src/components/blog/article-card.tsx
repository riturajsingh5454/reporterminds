import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt?: Date | string | null;
  readTimeMins: number;
  category?: { name: string; slug: string } | null;
};

export function ArticleCard({ article, featured = false }: { article: ArticleCardData; featured?: boolean }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div
        className={`bg-secondary/40 relative overflow-hidden rounded-xl border border-border/60 ${
          featured ? "aspect-[16/10]" : "aspect-[16/11]"
        }`}
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 480px, 90vw"
        />
      </div>
      <div className="mt-4">
        {article.category ? (
          <Badge variant="outline" className="mb-2">
            {article.category.name}
          </Badge>
        ) : null}
        <h3 className={`font-display leading-snug ${featured ? "text-2xl" : "text-lg"}`}>{article.title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">{article.excerpt}</p>
        <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
          {date ? <span>{date}</span> : null}
          <span>{article.readTimeMins} min read</span>
        </div>
      </div>
    </Link>
  );
}
