import { prisma, safeQuery } from "@/lib/prisma";
import { JsonLd } from "@/components/shared/json-ld";
import { Hero } from "@/components/home/hero";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturedBooks } from "@/components/home/featured-books";
import { LegacyTimeline } from "@/components/home/legacy-timeline";
import { FeaturedArticles } from "@/components/home/featured-articles";
import { YoutubePreview } from "@/components/home/youtube-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { CtaSection } from "@/components/home/cta-section";

export const revalidate = 300;

async function getHomeData() {
  const [
    siteSettings,
    articlesCount,
    booksCount,
    videosCount,
    featuredBooksRaw,
    timelineEvents,
    featuredArticlesRaw,
    featuredVideos,
    testimonials,
    galleryItems,
  ] = await Promise.all([
    safeQuery(() => prisma.siteSettings.findFirst(), null),
    safeQuery(() => prisma.article.count({ where: { status: "PUBLISHED" } }), 0),
    safeQuery(() => prisma.book.count({ where: { status: "PUBLISHED" } }), 0),
    safeQuery(() => prisma.video.count(), 0),
    safeQuery(
      () =>
        prisma.book.findMany({
          where: { status: "PUBLISHED", isFeatured: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
      [],
    ),
    safeQuery(() => prisma.timelineEvent.findMany({ orderBy: { order: "asc" }, take: 6 }), []),
    safeQuery(
      () =>
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
          take: 5,
          include: { category: true },
        }),
      [],
    ),
    safeQuery(() => prisma.video.findMany({ orderBy: { publishedAt: "desc" }, take: 6 }), []),
    safeQuery(
      () => prisma.testimonial.findMany({ where: { isFeatured: true }, orderBy: { order: "asc" }, take: 6 }),
      [],
    ),
    safeQuery(() => prisma.gallery.findMany({ orderBy: { order: "asc" }, take: 8 }), []),
  ]);

  return {
    siteSettings,
    stats: {
      yearsExperience: siteSettings?.yearsExperience ?? 20,
      articlesPublished: articlesCount,
      booksPublished: booksCount,
      studentsMentored: siteSettings?.studentsMentored ?? 0,
      videosCreated: videosCount,
    },
    featuredBooks: featuredBooksRaw,
    timelineEvents,
    featuredArticles: featuredArticlesRaw,
    featuredVideos,
    testimonials,
    galleryItems,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: data.siteSettings?.siteName ?? "ReportersMind",
          jobTitle: ["Journalist", "Author", "Professor"],
          description: data.siteSettings?.tagline ?? undefined,
          url: process.env.NEXT_PUBLIC_SITE_URL,
        }}
      />
      <Hero tagline={data.siteSettings?.tagline} />
      <StatsSection stats={data.stats} />
      <FeaturedBooks books={data.featuredBooks} />
      <LegacyTimeline events={data.timelineEvents} />
      <FeaturedArticles articles={data.featuredArticles} />
      <YoutubePreview videos={data.featuredVideos} />
      <TestimonialsSection testimonials={data.testimonials} />
      <GalleryPreview items={data.galleryItems} />
      <CtaSection />
    </>
  );
}
