import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/shared/newsletter-form";

export function CtaSection() {
  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl border p-10 text-center sm:p-16">
            <div className="bg-primary/15 absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl" />
            <h2 className="font-display relative text-balance text-3xl sm:text-4xl">
              Stay close to the story.
            </h2>
            <p className="text-muted-foreground relative mx-auto mt-4 max-w-xl text-base leading-relaxed">
              Join the newsletter for new essays and archive finds, or reach out directly for speaking
              engagements, media inquiries, and mentorship.
            </p>
            <div className="relative mt-8 flex flex-col items-center gap-4">
              <NewsletterForm source="home-cta" />
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button variant="outline" render={<Link href="/contact" />}>
                  <Mail className="size-4" /> Contact
                </Button>
                <Button variant="outline" render={<Link href="/contact?type=speaking" />}>
                  <MessageSquare className="size-4" /> Book a Talk
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
