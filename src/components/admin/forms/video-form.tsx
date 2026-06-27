"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Video, Playlist } from "@prisma/client";
import { createVideo, updateVideo } from "@/server/actions/videos";
import type { ActionResult } from "@/server/actions/books";

export function VideoForm({ video, playlists }: { video?: Video; playlists: Playlist[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result: ActionResult = video ? await updateVideo(video.id, formData) : await createVideo(formData);
      if (result.success) {
        toast.success(video ? "Video updated." : "Video added.");
        router.push("/admin/videos");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Video Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="youtubeId">YouTube Video ID</Label>
            <Input id="youtubeId" name="youtubeId" defaultValue={video?.youtubeId} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={video?.title} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={video?.description ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="thumbnail">Thumbnail URL (optional — auto-derived if blank)</Label>
            <Input id="thumbnail" name="thumbnail" defaultValue={video?.thumbnail ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Published Date</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="date"
              defaultValue={video?.publishedAt ? new Date(video.publishedAt).toISOString().slice(0, 10) : ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationSec">Duration (seconds)</Label>
            <Input id="durationSec" name="durationSec" type="number" defaultValue={video?.durationSec ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={video?.category ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playlistId">Playlist</Label>
            <Select name="playlistId" defaultValue={video?.playlistId ?? undefined}>
              <SelectTrigger id="playlistId">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={video?.isFeatured} />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : video ? "Save Changes" : "Add Video"}
      </Button>
    </form>
  );
}
