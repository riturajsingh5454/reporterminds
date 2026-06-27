"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import type { SEOSettings } from "@prisma/client";
import { createSeoSetting, updateSeoSetting } from "@/server/actions/seo";

export function SeoDialogForm({ entry }: { entry?: SEOSettings }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = entry ? await updateSeoSetting(entry.id, formData) : await createSeoSetting(formData);
      if (result.success) {
        toast.success(entry ? "SEO entry updated." : "SEO entry created.");
        setOpen(false);
        formRef.current?.reset();
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size={entry ? "icon-sm" : "sm"} variant={entry ? "ghost" : "default"} />}>
        {entry ? <Pencil className="size-3.5" /> : <><Plus className="size-4" /> New SEO Entry</>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Edit SEO Entry" : "New SEO Entry"}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="path">Path</Label>
            <Input id="path" name="path" placeholder="/about" defaultValue={entry?.path} required disabled={!!entry} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={entry?.title ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={entry?.description ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogImage">OG Image URL</Label>
            <Input id="ogImage" name="ogImage" defaultValue={entry?.ogImage ?? ""} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
