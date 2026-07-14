"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Gallery, GalleryCategory } from "@prisma/client";
import { createGalleryItem, updateGalleryItem } from "@/server/actions/gallery";
import type { ActionResult } from "@/server/actions/books";

export function GalleryForm({ item, categories }: { item?: Gallery; categories: GalleryCategory[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasFileError, setHasFileError] = useState(false);

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result: ActionResult = item
        ? await updateGalleryItem(item.id, formData)
        : await createGalleryItem(formData);
      if (result.success) {
        toast.success(item ? "Photo updated." : "Photo added.");
        router.push("/admin/gallery");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photo Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="imageFile">Upload Photo {!item && <span className="text-destructive">*</span>}</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              required={!item}
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
            {item?.imageUrl && (
              <p className="text-muted-foreground text-xs mt-1">
                Current:{" "}
                <a href={item.imageUrl} target="_blank" rel="noreferrer" className="underline">
                  {item.imageUrl}
                </a>
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="caption">Caption</Label>
            <Input id="caption" name="caption" defaultValue={item?.caption ?? ""} />
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
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input id="eventName" name="eventName" defaultValue={item?.eventName ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={item?.location ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input id="width" name="width" type="number" defaultValue={item?.width ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input id="height" name="height" type="number" defaultValue={item?.height ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending || hasFileError}>
        {isPending ? "Saving…" : item ? "Save Changes" : "Add Photo"}
      </Button>
    </form>
  );
}
