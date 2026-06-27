import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/forms/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Site Settings</h1>
        <p className="text-muted-foreground text-sm">Global configuration for ReportersMind.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
