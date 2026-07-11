"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Archive, ArchiveCategory } from "@prisma/client";
import { createArchiveItem, updateArchiveItem } from "@/server/actions/archive";
import { formatAttachmentsField } from "@/lib/validations/archive";
import type { ActionResult } from "@/server/actions/books";

export function ArchiveForm({ item, categories }: { item?: Archive; categories: ArchiveCategory[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasFileError, setHasFileError] = useState(false);

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result: ActionResult = item
        ? await updateArchiveItem(item.id, formData)
        : await createArchiveItem(formData);
      if (result.success) {
        toast.success(item ? "Archive entry updated." : "Archive entry created.");
        router.push("/admin/archive");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Entry Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input id="title" name="title" defaultValue={item?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
            <Input id="slug" name="slug" defaultValue={item?.slug} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year <span className="text-destructive">*</span></Label>
            <Input id="year" name="year" type="number" defaultValue={item?.year} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publication">Publication</Label>
            <Input id="publication" name="publication" defaultValue={item?.publication ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="content">Content / Description</Label>
            <Textarea id="content" name="content" rows={5} defaultValue={item?.content ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Select name="section" defaultValue={item?.section ?? "JOURNALISM"}>
              <SelectTrigger id="section">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JOURNALISM">Journalism Archive</SelectItem>
                <SelectItem value="LEGACY_PRINT">Legacy in Print</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" defaultValue={item?.categoryId}>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({cat.section === "JOURNALISM" ? "Journalism" : "Legacy"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" defaultValue={item?.tags.join(", ")} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={item?.isFeatured} />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attachments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="pdfFile">Upload PDF</Label>
            <Input
              id="pdfFile"
              name="pdfFile"
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 5 * 1024 * 1024) {
                  toast.error("File size must not exceed 5MB");
                  setHasFileError(true);
                  e.target.value = "";
                } else {
                  setHasFileError(false);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachments">Or manual URLs (One per line: url, type, label)</Label>
            <Textarea
              id="attachments"
              name="attachments"
              rows={3}
              placeholder="/uploads/clipping.pdf, pdf, Original clipping"
              defaultValue={formatAttachmentsField(item?.attachments)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={item?.metaTitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input id="metaDescription" name="metaDescription" defaultValue={item?.metaDescription ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending || hasFileError}>
        {isPending ? "Saving…" : item ? "Save Changes" : "Create Entry"}
      </Button>
    </form>
  );
}
