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
import type { Testimonial } from "@prisma/client";
import { createTestimonial, updateTestimonial } from "@/server/actions/testimonials";
import type { ActionResult } from "@/server/actions/books";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasFileError, setHasFileError] = useState(false);

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result: ActionResult = testimonial
        ? await updateTestimonial(testimonial.id, formData)
        : await createTestimonial(formData);
      if (result.success) {
        toast.success(testimonial ? "Testimonial updated." : "Testimonial added.");
        router.push("/admin/testimonials");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Testimonial</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="authorName">Author Name <span className="text-destructive">*</span></Label>
            <Input id="authorName" name="authorName" defaultValue={testimonial?.authorName} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" defaultValue={testimonial?.role ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" defaultValue={testimonial?.company ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarFile">Avatar Image</Label>
            <Input
              id="avatarFile"
              name="avatarFile"
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
            {testimonial?.avatarUrl && (
              <p className="text-muted-foreground text-xs mt-1">
                Current:{" "}
                <a href={testimonial.avatarUrl} target="_blank" rel="noreferrer" className="underline">
                  {testimonial.avatarUrl}
                </a>
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="content">Testimonial Content <span className="text-destructive">*</span></Label>
            <Textarea id="content" name="content" rows={4} defaultValue={testimonial?.content} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={testimonial?.type ?? "TEXT"}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (if video)</Label>
            <Input id="videoUrl" name="videoUrl" defaultValue={testimonial?.videoUrl ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={testimonial?.category ?? "PROFESSIONAL"}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? ""} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={testimonial?.isFeatured} />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending || hasFileError}>
        {isPending ? "Saving…" : testimonial ? "Save Changes" : "Add Testimonial"}
      </Button>
    </form>
  );
}
