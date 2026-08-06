import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { VideoCard, type VideoCardData } from "@/components/youtube/video-card";
import { YoutubeIcon } from "@/components/shared/social-icons";

export function YoutubePreview({
  videos,
  subscriberLabel,
}: {
  videos: VideoCardData[];
  subscriberLabel?: string;
}) {
  if (videos.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="YouTube Hub"
            title="Watch & Learn"
            description={subscriberLabel ?? "Educational videos on journalism, climate, and the craft of storytelling."}
          />
          <Button variant="outline" render={<Link href="/youtube" />}>
            Visit Channel <ArrowRight className="size-4" />
          </Button>
        </div>

        <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <RevealItem key={video.youtubeId}>
              <VideoCard video={video} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex justify-center">
          <Button size="lg" render={<a href="https://www.youtube.com/@SanjayMohanJohri" target="_blank" rel="noreferrer" />}>
            <YoutubeIcon className="size-4" /> Subscribe on YouTube
          </Button>
        </div>
      </Container>
    </section>
  );
}
