import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { TwitterXIcon, LinkedInIcon, YoutubeIcon, InstagramIcon } from "@/components/shared/social-icons";

export type SocialLinksData = {
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
};

export function SocialLinks({ links }: { links: SocialLinksData | null }) {
  if (!links) return null;

  const items = [
    { href: links.twitter, icon: TwitterXIcon, label: "Twitter" },
    { href: links.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { href: links.youtube, icon: YoutubeIcon, label: "YouTube" },
    { href: links.instagram, icon: InstagramIcon, label: "Instagram" },
  ].filter((item) => Boolean(item.href));

  if (items.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-display text-2xl">Follow the Story</h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="text-muted-foreground hover:text-foreground hover:bg-accent flex size-11 items-center justify-center rounded-full border border-border/60 transition-colors"
              >
                <item.icon className="size-5" />
              </a>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
