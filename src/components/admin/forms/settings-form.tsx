"use client";

import { useTransition } from "react";
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
  const socialLinks = (settings?.socialLinks as Record<string, string> | null) ?? {};

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (result.success) toast.success("Settings saved.");
      else toast.error(result.error ?? "Something went wrong.");
    });
  };

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" name="siteName" defaultValue={settings?.siteName ?? "ReportersMind"} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" name="logoUrl" defaultValue={settings?.logoUrl ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea id="tagline" name="tagline" rows={2} defaultValue={settings?.tagline ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="heroMedia">Hero Media URL</Label>
            <Input id="heroMedia" name="heroMedia" defaultValue={settings?.heroMedia ?? ""} />
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
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input id="twitter" name="twitter" defaultValue={socialLinks.twitter ?? ""} />
          </div>
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

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
