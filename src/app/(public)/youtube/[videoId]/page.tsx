import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/youtube/video-card";

export const revalidate = 300;

async function getVideo(youtubeId: string) {
  return prisma.video.findUnique({ where: { youtubeId }, include: { playlist: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ videoId: string }> }): Promise<Metadata> {
  const { videoId } = await params;
  const video = await getVideo(videoId);
  if (!video) return {};
  return { title: video.title, description: video.description ?? undefined, openGraph: { images: [video.thumbnail] } };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  const video = await getVideo(videoId);
  if (!video) notFound();

  const relatedVideos = await prisma.video.findMany({
    where: { youtubeId: { not: videoId }, ...(video.playlistId ? { playlistId: video.playlistId } : {}) },
    take: 4,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="py-16">
        <Container className="max-w-4xl">
          <Reveal>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <h1 className="font-display mt-8 text-balance text-3xl sm:text-4xl">{video.title}</h1>
            <div className="text-muted-foreground mt-3 flex items-center gap-3 text-sm">
              <span>{video.viewCount.toLocaleString()} views</span>
              <span>{new Date(video.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              {video.playlist ? <span>{video.playlist.title}</span> : null}
            </div>
            {video.description ? (
              <p className="text-foreground/90 mt-6 whitespace-pre-line text-sm leading-relaxed">{video.description}</p>
            ) : null}
          </Reveal>
        </Container>
      </section>

      {relatedVideos.length > 0 ? (
        <section className="bg-secondary/30 py-16">
          <Container>
            <h2 className="font-display text-2xl">Related Videos</h2>
            <Separator className="my-8" />
            <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedVideos.map((v) => (
                <RevealItem key={v.youtubeId}>
                  <VideoCard video={v} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}
    </>
  );
}
