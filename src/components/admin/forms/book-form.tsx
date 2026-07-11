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
import type { Book } from "@prisma/client";
import { createBook, updateBook, type ActionResult } from "@/server/actions/books";

export function BookForm({ book }: { book?: Book }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasFileError, setHasFileError] = useState(false);
  const purchaseLinks = (book?.purchaseLinks as { amazon?: string; flipkart?: string } | null) ?? {};

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result: ActionResult = book ? await updateBook(book.id, formData) : await createBook(formData);
      if (result.success) {
        toast.success(book ? "Book updated." : "Book created.");
        router.push("/admin/books");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Book Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input id="title" name="title" defaultValue={book?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
            <Input id="slug" name="slug" defaultValue={book?.slug} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" defaultValue={book?.subtitle ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea id="description" name="description" rows={5} defaultValue={book?.description} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Cover Image {!book && <span className="text-destructive">*</span>}</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              required={!book}
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
            {book?.coverImage && (
              <p className="text-muted-foreground text-xs mt-1">
                Current:{" "}
                <a href={book.coverImage} target="_blank" rel="noreferrer" className="underline">
                  {book.coverImage}
                </a>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="galleryFiles">Gallery Images</Label>
            <Input
              id="galleryFiles"
              name="galleryFiles"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  for (let i = 0; i < files.length; i++) {
                    if (files[i].size > 1 * 1024 * 1024) {
                      toast.error("Each file must not exceed 1MB");
                      setHasFileError(true);
                      e.target.value = "";
                      return;
                    }
                  }
                  setHasFileError(false);
                } else {
                  setHasFileError(false);
                }
              }}
            />
            {book?.galleryImages && book.galleryImages.length > 0 && (
              <p className="text-muted-foreground text-xs mt-1">
                Current: {book.galleryImages.length} image(s)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" name="isbn" defaultValue={book?.isbn ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input id="publisher" name="publisher" defaultValue={book?.publisher ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishedYear">Published Year</Label>
            <Input id="publishedYear" name="publishedYear" type="number" defaultValue={book?.publishedYear ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" name="language" defaultValue={book?.language ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pages">Pages</Label>
            <Input id="pages" name="pages" type="number" defaultValue={book?.pages ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={book?.price ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={book?.category ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amazonUrl">Amazon URL</Label>
            <Input id="amazonUrl" name="amazonUrl" defaultValue={purchaseLinks.amazon ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flipkartUrl">Flipkart URL</Label>
            <Input id="flipkartUrl" name="flipkartUrl" defaultValue={purchaseLinks.flipkart ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={book?.status ?? "DRAFT"}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={book?.isFeatured} />
            <Label htmlFor="isFeatured">Featured</Label>
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
            <Input id="metaTitle" name="metaTitle" defaultValue={book?.metaTitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input id="metaDescription" name="metaDescription" defaultValue={book?.metaDescription ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending || hasFileError}>
        {isPending ? "Saving…" : book ? "Save Changes" : "Create Book"}
      </Button>
    </form>
  );
}
