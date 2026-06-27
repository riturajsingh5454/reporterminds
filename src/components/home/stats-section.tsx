import { Container } from "@/components/shared/container";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export type StatsData = {
  yearsExperience: number;
  articlesPublished: number;
  booksPublished: number;
  studentsMentored: number;
  videosCreated: number;
};

export function StatsSection({ stats }: { stats: StatsData }) {
  const items = [
    { label: "Years of Experience", value: stats.yearsExperience, suffix: "+" },
    { label: "Published Articles", value: stats.articlesPublished, suffix: "+" },
    { label: "Books Published", value: stats.booksPublished, suffix: "" },
    { label: "Students Mentored", value: stats.studentsMentored, suffix: "+" },
    { label: "Videos Created", value: stats.videosCreated, suffix: "+" },
  ];

  return (
    <section className="border-y border-border/60 bg-secondary/30 py-16">
      <Container>
        <RevealGroup className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          {items.map((item) => (
            <RevealItem key={item.label} className="text-center">
              <AnimatedCounter
                value={item.value}
                suffix={item.suffix}
                className="font-display text-3xl sm:text-4xl"
              />
              <p className="text-muted-foreground mt-2 text-xs tracking-wide uppercase sm:text-sm">
                {item.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
