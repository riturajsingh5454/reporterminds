"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/server/actions/books";

export type CategoryItem = { id: string; name: string; slug: string; badge?: string };

export function CategorySection({
  title,
  items,
  createAction,
  deleteAction,
  sectionOptions,
}: {
  title: string;
  items: CategoryItem[];
  createAction: (formData: FormData) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
  sectionOptions?: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      const result = await createAction(formData);
      if (result.success) {
        toast.success("Category added.");
        setOpen(false);
        formRef.current?.reset();
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to add category.");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result.success) {
        toast.success("Category deleted.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete category.");
      }
    });
  };

  return (
    <div className="rounded-lg border border-border/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">{title}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" variant="outline" />}>
            <Plus className="size-3.5" /> Add
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New {title} Category</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={handleCreate} className="space-y-4">
              <Input name="name" placeholder="Category name" required />
              {sectionOptions ? (
                <Select name="section" defaultValue={sectionOptions[0]?.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No categories yet.</p>
        ) : (
          items.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-sm"
            >
              {item.name}
              {item.badge ? (
                <Badge variant="secondary" className="text-[10px]">
                  {item.badge}
                </Badge>
              ) : null}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                aria-label={`Delete ${item.name}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
