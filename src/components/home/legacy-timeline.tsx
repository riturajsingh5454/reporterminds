import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type TimelineEventData = {
  id: string;
  year: number;
  title: string;
  description: string;
  category: string;
};

export function LegacyTimeline({ events }: { events: TimelineEventData[] }) {
  if (events.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Journalism Legacy"
            title="Three Decades in Motion"
            description="From the PTI newsroom to the lecture hall — a journey through journalism's front lines."
          />
          <Button variant="outline" render={<Link href="/about" />}>
            Full Timeline <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="relative mt-16">
          <div className="absolute inset-y-0 left-4 w-px bg-border sm:left-1/2" />
          <div className="space-y-12">
            {events.map((event, idx) => (
              <Reveal key={event.id} direction={idx % 2 === 0 ? "left" : "right"}>
                <div
                  className={`relative flex flex-col gap-4 pl-12 sm:w-1/2 sm:pl-0 ${
                    idx % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-[50%] sm:pl-12"
                  }`}
                >
                  <span className="bg-primary absolute top-1 left-2.5 size-3 -translate-x-1/2 rounded-full sm:left-1/2" />
                  <div className={idx % 2 === 0 ? "sm:flex sm:flex-col sm:items-end" : ""}>
                    <Badge variant="secondary" className="mb-2">
                      {event.year} · {event.category}
                    </Badge>
                    <h3 className="font-display text-xl">{event.title}</h3>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
