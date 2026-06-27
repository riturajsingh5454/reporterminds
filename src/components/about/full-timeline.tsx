"use client";

import { useState } from "react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TimelineEventData = {
  id: string;
  year: number;
  title: string;
  description: string;
  category: "CAREER" | "ACADEMIC" | "MEDIA" | "AWARD";
};

const categoryLabels: Record<string, string> = {
  ALL: "All",
  CAREER: "Career",
  ACADEMIC: "Academic",
  MEDIA: "Media",
  AWARD: "Awards",
};

export function FullTimeline({ events }: { events: TimelineEventData[] }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? events : events.filter((e) => e.category === filter);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="The Journey"
          title="Career & Academic Timeline"
          description="From the PTI newsroom to the lecture hall — every chapter, in order."
        />

        <Tabs value={filter} onValueChange={setFilter} className="mt-10">
          <TabsList>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative mt-12">
          <div className="absolute inset-y-0 left-2.5 w-px bg-border" />
          <div className="space-y-10">
            {filtered.map((event) => (
              <Reveal key={event.id} direction="left">
                <div className="relative flex gap-6 pl-10">
                  <span className="bg-primary absolute left-2 top-1.5 size-2.5 -translate-x-1/2 rounded-full" />
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {event.year} · {categoryLabels[event.category]}
                    </Badge>
                    <h3 className="font-display text-xl">{event.title}</h3>
                    <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {filtered.length === 0 ? (
              <p className="text-muted-foreground pl-10 text-sm">No entries in this category yet.</p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
