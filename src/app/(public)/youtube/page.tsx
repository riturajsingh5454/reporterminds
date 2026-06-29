import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { VideoCard } from "@/components/youtube/video-card";
import { Button } from "@/components/ui/button";
import { YoutubeIcon } from "@/components/shared/social-icons";
export const metadata: Metadata = { title: "YouTube Hub" };
export const revalidate = 300;

export default async function YoutubePage() {
  const [videos, playlists, totalViews] = await Promise.all([
    safeQuery(() => prisma.video.findMany({ orderBy: { publishedAt: "desc" } }), []),
    safeQuery(
      () => prisma.playlist.findMany({ include: { videos: { take: 1 } }, orderBy: { createdAt: "desc" } }),
      [],
    ),
    safeQuery(() => prisma.video.aggregate({ _sum: { viewCount: true } }), { _sum: { viewCount: 0 } }),
  ]);


  const categories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean))) as string[];

  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Media Library"
            title="YouTube Hub"
            description="Educational videos on journalism, climate science, and the craft of storytelling."
          />

          <Button
            nativeButton={false}
            render={
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <YoutubeIcon className="size-4" />
            Subscribe
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6 rounded-xl border border-border/60 bg-secondary/30 p-6 sm:max-w-md">
          <div className="text-center">
            <AnimatedCounter value={videos.length} className="font-display text-2xl" />
            <p className="text-muted-foreground mt-1 text-xs uppercase">Videos</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={playlists.length} className="font-display text-2xl" />
            <p className="text-muted-foreground mt-1 text-xs uppercase">Playlists</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={totalViews._sum.viewCount ?? 0} className="font-display text-2xl" />
            <p className="text-muted-foreground mt-1 text-xs uppercase">Total Views</p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="rounded-full border border-border/60 px-3 py-1 text-xs">
                {cat}
              </span>
            ))}
          </div>
        ) : null}

        <h2 className="font-display mt-16 text-2xl">Latest Videos</h2>
        {videos.length === 0 ? (
          <p className="text-muted-foreground mt-6 text-sm">No videos synced yet.</p>
        ) : (
          <RevealGroup className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <RevealItem key={video.youtubeId}>
                <VideoCard video={video} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {playlists.length > 0 ? (
          <>
            <h2 className="font-display mt-16 text-2xl">Playlists</h2>
            <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <RevealItem
                  key={playlist.id}
                  className="rounded-xl border border-border/60 p-5"
                >
                  <h3 className="font-display text-lg">{playlist.title}</h3>
                  {playlist.description ? (
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{playlist.description}</p>
                  ) : null}
                </RevealItem>
              ))}
            </RevealGroup>
          </>
        ) : null}
      </Container>
    </section>
  );
}
