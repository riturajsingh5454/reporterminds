"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "@prisma/client";
import { updateSiteSettings } from "@/server/actions/settings";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [hasFileError, setHasFileError] = useState(false);
  const socialLinks = (settings?.socialLinks as Record<string, string> | null) ?? {};

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (result.success) toast.success("Settings saved.");
      else toast.error(result.error ?? "Something went wrong.");
    });
  };

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name <span className="text-destructive">*</span></Label>
            <Input id="siteName" name="siteName" defaultValue={settings?.siteName ?? "ReportersMind"} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoFile">Logo Image</Label>
            <Input
              id="logoFile"
              name="logoFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 1 * 1024 * 1024) {
                  toast.error("File size must not exceed 1MB");
                  setHasFileError(true);
                  e.target.value = "";
                } else {
                  setHasFileError(false);
                }
              }}
            />
            {settings?.logoUrl && (
              <p className="text-muted-foreground text-xs mt-1">
                Current:{" "}
                <a href={settings.logoUrl} target="_blank" rel="noreferrer" className="underline">
                  {settings.logoUrl}
                </a>
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea id="tagline" name="tagline" rows={2} defaultValue={settings?.tagline ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="heroMediaFile">Hero Media Image</Label>
            <Input
              id="heroMediaFile"
              name="heroMediaFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 1 * 1024 * 1024) {
                  toast.error("File size must not exceed 1MB");
                  setHasFileError(true);
                  e.target.value = "";
                } else {
                  setHasFileError(false);
                }
              }}
            />
            {settings?.heroMedia && (
              <p className="text-muted-foreground text-xs mt-1">
                Current:{" "}
                <a href={settings.heroMedia} target="_blank" rel="noreferrer" className="underline">
                  {settings.heroMedia}
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stats &amp; Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings?.contactEmail ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtubeChannelId">YouTube Channel ID</Label>
            <Input id="youtubeChannelId" name="youtubeChannelId" defaultValue={settings?.youtubeChannelId ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input id="yearsExperience" name="yearsExperience" type="number" defaultValue={settings?.yearsExperience ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentsMentored">Students Mentored</Label>
            <Input id="studentsMentored" name="studentsMentored" type="number" defaultValue={settings?.studentsMentored ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="articlesPublished">Published Articles</Label>
            <Input
              id="articlesPublished"
              name="articlesPublished"
              type="number"
              placeholder="Auto-counted from published articles"
              defaultValue={settings?.articlesPublished ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booksPublished">Books Published</Label>
            <Input
              id="booksPublished"
              name="booksPublished"
              type="number"
              placeholder="Auto-counted from published books"
              defaultValue={settings?.booksPublished ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videosCreated">Videos Created</Label>
            <Input
              id="videosCreated"
              name="videosCreated"
              type="number"
              placeholder="Auto-counted from videos"
              defaultValue={settings?.videosCreated ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="analyticsId">Analytics ID</Label>
            <Input id="analyticsId" name="analyticsId" defaultValue={settings?.analyticsId ?? ""} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="maintenanceMode" name="maintenanceMode" defaultChecked={settings?.maintenanceMode} />
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
         
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" name="linkedin" defaultValue={socialLinks.linkedin ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input id="youtube" name="youtube" defaultValue={socialLinks.youtube ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" name="instagram" defaultValue={socialLinks.instagram ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending || hasFileError}>
        {isPending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
