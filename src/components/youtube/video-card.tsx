import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export type VideoCardData = {
  youtubeId: string;
  title: string;
  thumbnail: string;
  durationSec?: number | null;
  viewCount: number;
};

function formatDuration(seconds?: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatViews(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

export function VideoCard({ video }: { video: VideoCardData }) {
  return (
    <Link href={`/youtube/${video.youtubeId}`} className="group block">
      <div className="bg-secondary/40 relative aspect-video overflow-hidden rounded-xl border border-border/60">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 400px, 90vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Play className="size-5 fill-current text-black" />
          </span>
        </div>
        {formatDuration(video.durationSec) ? (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(video.durationSec)}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-snug">{video.title}</h3>
      {/* <p className="text-muted-foreground mt-1 text-xs">{formatViews(video.viewCount)}</p> */}
    </Link>
  );
}
