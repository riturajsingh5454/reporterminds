import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategorySection } from "@/components/admin/forms/category-section";
import { createTag, deleteTag } from "@/server/actions/tags";

export const metadata: Metadata = { title: "Tags" };

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Tags</h1>
        <p className="text-muted-foreground text-sm">Manage tags used across articles.</p>
      </div>

      <CategorySection title="Tags" items={tags} createAction={createTag} deleteAction={deleteTag} />
    </div>
  );
}
