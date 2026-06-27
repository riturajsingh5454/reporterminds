import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

export function Biography({ tagline }: { tagline?: string | null }) {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <Reveal>
          <span className="text-primary mb-3 block text-xs font-semibold tracking-[0.2em] uppercase">
            Biography
          </span>
          <h1 className="font-display text-balance text-4xl sm:text-5xl">A life spent chasing the story.</h1>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            {tagline ?? "Journalist, author, professor, and climate communicator."}
          </p>
          <div className="prose-neutral mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            <p>
              For over two decades, a single conviction has guided every byline, lecture, and broadcast:
              that good journalism is an act of public service. What began as a cub reporter&apos;s desk at the
              Press Trust of India grew into a career spanning newsrooms, lecture halls, and now, the
              camera lens — always in pursuit of stories that matter.
            </p>
            <p>
              Along the way, the beat shifted from daily news to the slower, more urgent story of a
              changing climate — reporting from flood zones, drought-stricken villages, and international
              climate summits, translating complex science into language that moves people to act.
            </p>
            <p>
              Today, that same instinct for storytelling lives on in the classroom, mentoring the next
              generation of journalists, and on this platform — a single home for three decades of
              reporting, writing, and teaching.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
