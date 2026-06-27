import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PurchaseLinks({ links }: { links: unknown }) {
  if (!links || typeof links !== "object") return null;
  const entries = Object.entries(links as Record<string, string>).filter(([, url]) => Boolean(url));
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([store, url]) => (
        <Button key={store} variant="outline" render={<a href={url} target="_blank" rel="noreferrer" />}>
          Buy on {store.charAt(0).toUpperCase() + store.slice(1)} <ExternalLink className="size-3.5" />
        </Button>
      ))}
    </div>
  );
}
