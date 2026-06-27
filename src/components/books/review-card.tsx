import { Star } from "lucide-react";

export type ReviewCardData = {
  id: string;
  reviewerName: string;
  rating: number;
  content: string;
  source?: string | null;
};

export function ReviewCard({ review }: { review: ReviewCardData }) {
  return (
    <div className="rounded-xl border border-border/60 p-5">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`size-3.5 ${i < review.rating ? "fill-current text-primary" : "text-muted-foreground/30"}`} />
        ))}
      </div>
      <p className="text-foreground/90 mt-3 text-sm leading-relaxed">{review.content}</p>
      <p className="text-muted-foreground mt-3 text-xs font-medium">
        {review.reviewerName}
        {review.source ? ` · ${review.source}` : ""}
      </p>
    </div>
  );
}
