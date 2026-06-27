import { Play, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type TestimonialCardData = {
  type: "TEXT" | "VIDEO";
  authorName: string;
  role?: string | null;
  company?: string | null;
  content: string;
  videoUrl?: string | null;
  avatarUrl?: string | null;
};

export function TestimonialCard({ testimonial }: { testimonial: TestimonialCardData }) {
  const initials = testimonial.authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-6">
      {testimonial.type === "VIDEO" && testimonial.videoUrl ? (
        <div className="bg-secondary relative mb-4 aspect-video overflow-hidden rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/90">
              <Play className="size-5 fill-current text-black" />
            </span>
          </div>
        </div>
      ) : (
        <Quote className="text-primary/40 mb-4 size-8" />
      )}
      <p className="text-foreground/90 flex-1 text-sm leading-relaxed italic">&ldquo;{testimonial.content}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <Avatar>
          {testimonial.avatarUrl ? <AvatarImage src={testimonial.avatarUrl} alt={testimonial.authorName} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{testimonial.authorName}</p>
          <p className="text-muted-foreground text-xs">
            {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
