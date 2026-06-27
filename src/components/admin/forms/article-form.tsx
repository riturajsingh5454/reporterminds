"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/forms/rich-text-editor";
import type { Article, ArticleCategory, Tag } from "@prisma/client";
import { createArticle, updateArticle } from "@/server/actions/articles";
import type { ActionResult } from "@/server/actions/books";

export function ArticleForm({
  article,
  categories,
  articleTags,
}: {
  article?: Article;
  categories: ArticleCategory[];
  articleTags?: Tag[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [contentHtml, setContentHtml] = useState(article?.contentHtml ?? "");

  const action = (formData: FormData) => {
    formData.set("contentHtml", contentHtml);
    startTransition(async () => {
      const result: ActionResult = article ? await updateArticle(article.id, formData) : await createArticle(formData);
      if (result.success) {
        toast.success(article ? "Article updated." : "Article created.");
        router.push("/admin/articles");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={article?.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={article?.slug} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input id="coverImage" name="coverImage" defaultValue={article?.coverImage} required />
          </div>
          <div className="space-y-2">
            <Label>Body</Label>
            <RichTextEditor defaultValue={article?.contentHtml} onChange={setContentHtml} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" defaultValue={article?.categoryId ?? undefined}>
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
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" defaultValue={articleTags?.map((t) => t.name).join(", ")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readTimeMins">Read Time (mins)</Label>
            <Input id="readTimeMins" name="readTimeMins" type="number" defaultValue={article?.readTimeMins ?? 5} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={article?.status ?? "DRAFT"}>
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
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled For</Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              defaultValue={article?.scheduledAt ? new Date(article.scheduledAt).toISOString().slice(0, 16) : ""}
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={article?.isFeatured} />
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
            <Input id="metaTitle" name="metaTitle" defaultValue={article?.metaTitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input id="metaDescription" name="metaDescription" defaultValue={article?.metaDescription ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : article ? "Save Changes" : "Create Article"}
      </Button>
    </form>
  );
}
