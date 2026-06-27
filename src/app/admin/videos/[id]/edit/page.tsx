import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/forms/video-form";

export const metadata: Metadata = { title: "Edit Video" };

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [video, playlists] = await Promise.all([
    prisma.video.findUnique({ where: { id } }),
    prisma.playlist.findMany({ orderBy: { title: "asc" } }),
  ]);
  if (!video) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit Video</h1>
        <p className="text-muted-foreground text-sm">{video.title}</p>
      </div>
      <VideoForm video={video} playlists={playlists} />
    </div>
  );
}
