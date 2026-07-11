"use client";

import { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = testimonial.authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const isLong = testimonial.content.length > 250;

  return (
    <div className="glass flex h-[450px] w-full flex-col rounded-2xl p-6">
      {testimonial.type === "VIDEO" && testimonial.videoUrl ? (
        <div className="bg-secondary relative mb-4 shrink-0 aspect-video overflow-hidden rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/90">
              <Play className="size-5 fill-current text-black" />
            </span>
          </div>
        </div>
      ) : (
        <Quote className="text-primary/40 mb-4 size-8 shrink-0" />
      )}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
        <p className={`text-foreground/90 text-sm leading-relaxed italic ${!isExpanded && isLong ? "line-clamp-[8]" : ""}`}>
          &ldquo;{testimonial.content}&rdquo;
        </p>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary mt-2 text-sm font-medium hover:underline focus:outline-none"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
      <div className="mt-4 flex shrink-0 items-center gap-3 pt-2 border-t border-border/5">
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
