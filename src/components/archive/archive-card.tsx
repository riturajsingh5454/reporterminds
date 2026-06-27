import Link from "next/link";
import { FileText, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ArchiveCardData = {
  slug: string;
  title: string;
  year: number;
  publication?: string | null;
  category: { name: string; slug: string };
};

export function ArchiveCard({ archive }: { archive: ArchiveCardData }) {
  return (
    <Link
      href={`/archive/${archive.category.slug}/${archive.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/60 p-5 transition-colors hover:bg-accent/40"
    >
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{archive.category.name}</Badge>
        <span className="text-muted-foreground text-xs">{archive.year}</span>
      </div>
      <h3 className="font-display text-lg leading-snug group-hover:text-primary">{archive.title}</h3>
      {archive.publication ? (
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Newspaper className="size-3.5" /> {archive.publication}
        </p>
      ) : null}
      <span className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
        <FileText className="size-3.5" /> View Archive
      </span>
    </Link>
  );
}
