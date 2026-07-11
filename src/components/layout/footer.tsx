import Link from "next/link";
import { Container } from "@/components/shared/container";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { footerLinkGroups } from "@/lib/nav-links";
import { LinkedInIcon, YoutubeIcon, InstagramIcon } from "@/components/shared/social-icons";

const socials = [

  { href: "https://in.linkedin.com/in/dr-sanjay-johri", icon: LinkedInIcon, label: "LinkedIn" },
  { href: "https://www.youtube.com/@SanjayMohanJohri/videos", icon: YoutubeIcon, label: "YouTube" },
  { href: "https://www.instagram.com/sanjaymjohri/", icon: InstagramIcon, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-border/60 bg-secondary/30 mt-32 border-t">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/whitelogo.jpeg"
                alt="ReportersMind Logo"
                className="size-10 rounded object-cover"
              />
              <span className="font-display text-lg tracking-tight">ReportersMind</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              Journalist, author, professor, and climate communicator — chronicling the stories that
              shape our world.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent flex size-9 items-center justify-center rounded-full border border-border/60 transition-colors"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase">Stay Informed</h3>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              New essays, archive finds, and videos — straight to your inbox.
            </p>
            <NewsletterForm source="footer" className="mt-4" />
          </div>
        </div>

        <div className="text-muted-foreground mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} ReportersMind. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <Link href="/feed.xml" className="hover:text-foreground transition-colors">
              RSS
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
