import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { prisma, safeQuery } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = { title: "Contact" };

const typeMap: Record<string, string> = {
  speaking: "SPEAKING",
  media: "MEDIA_INQUIRY",
  meeting: "MEETING",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const siteSettings = await safeQuery(() => prisma.siteSettings.findFirst(), null);


  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact"
          description="For speaking invitations, media inquiries, meeting requests, or just to say hello."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="space-y-6">
              {siteSettings?.contactEmail ? (
                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-0.5 size-5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${siteSettings.contactEmail}`} className="text-muted-foreground text-sm">
                      {siteSettings.contactEmail}
                    </a>
                  </div>
                </div>
              ) : null}
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 size-5" />
                <div>
                  <p className="font-medium">Based In</p>
                  <p className="text-muted-foreground text-sm">Available for engagements worldwide</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="rounded-2xl border border-border/60 p-6 sm:p-8">
              <ContactForm defaultType={type ? typeMap[type] ?? "GENERAL" : "GENERAL"} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
