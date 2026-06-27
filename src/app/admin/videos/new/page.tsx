import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/forms/video-form";

export const metadata: Metadata = { title: "Add Video" };

export default async function NewVideoPage() {
  const playlists = await prisma.playlist.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Add Video</h1>
        <p className="text-muted-foreground text-sm">Add a video to the YouTube Hub.</p>
      </div>
      <VideoForm playlists={playlists} />
    </div>
  );
}
