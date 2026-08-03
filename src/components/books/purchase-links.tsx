import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PurchaseLinks({ links }: { links: unknown }) {
  if (!links || typeof links !== "object") return null;
  const entries = Object.entries(links as Record<string, string>).filter(([, url]) => Boolean(url));
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([store, url]) => (
        <Button
          key={store}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2"
          render={<a href={url} target="_blank" rel="noreferrer" />}
        >
          <ShoppingCart className="size-4" /> Buy on {store.charAt(0).toUpperCase() + store.slice(1)}
        </Button>
      ))}
    </div>
  );
}
