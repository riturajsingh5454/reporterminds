import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Biography } from "@/components/about/biography";
import { FullTimeline } from "@/components/about/full-timeline";
import { AchievementsGrid } from "@/components/about/achievements-grid";
import { SocialLinks, type SocialLinksData } from "@/components/about/social-links";
import { GalleryPreview } from "@/components/home/gallery-preview";

export const metadata: Metadata = { title: "About" };
export const revalidate = 300;

export default async function AboutPage() {
  const [siteSettings, timelineEvents, achievements, galleryItems] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.timelineEvent.findMany({ orderBy: { year: "asc" } }),
    prisma.achievement.findMany({ orderBy: { year: "desc" } }),
    prisma.gallery.findMany({ where: {}, orderBy: { order: "asc" }, take: 4 }),
  ]);

  return (
    <>
      <Biography tagline={siteSettings?.tagline} />
      <FullTimeline events={timelineEvents} />
      <AchievementsGrid achievements={achievements} />
      <GalleryPreview items={galleryItems} />
      <SocialLinks links={siteSettings?.socialLinks as SocialLinksData | null} />
    </>
  );
}
