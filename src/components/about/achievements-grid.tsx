import { Award, Star, Trophy } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export type AchievementData = {
  id: string;
  title: string;
  description?: string | null;
  year: number;
  category: "AWARD" | "RECOGNITION" | "MILESTONE";
  issuer?: string | null;
};

const categoryIcons = {
  AWARD: Trophy,
  RECOGNITION: Star,
  MILESTONE: Award,
};

export function AchievementsGrid({ achievements }: { achievements: AchievementData[] }) {
  if (achievements.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-20">
      <Container>
        <SectionHeading
          eyebrow="Recognition"
          title="Achievements & Awards"
          description="Milestones earned across a career in journalism and education."
        />

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const Icon = categoryIcons[a.category];
            return (
              <RevealItem key={a.id} className="glass rounded-xl p-6">
                <Icon className="text-primary mb-4 size-6" />
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{a.year}</p>
                <h3 className="font-display mt-1 text-lg leading-snug">{a.title}</h3>
                {a.issuer ? <p className="text-muted-foreground mt-2 text-sm">{a.issuer}</p> : null}
                {a.description ? (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{a.description}</p>
                ) : null}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
