import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <span className="text-primary mb-3 block text-xs font-semibold tracking-[0.2em] uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl leading-tight font-medium sm:text-4xl">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
