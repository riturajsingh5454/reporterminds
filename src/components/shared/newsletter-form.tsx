"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/server/actions/newsletter";
import { cn } from "@/lib/utils";

export function NewsletterForm({ source, className }: { source?: string; className?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className={cn("flex w-full max-w-md gap-2", className)}
      action={(formData) => {
        startTransition(async () => {
          const result = await subscribeToNewsletter(formData);
          if (result.success) {
            toast.success("Subscribed — welcome aboard.");
            formRef.current?.reset();
          } else {
            toast.error(result.error);
          }
        });
      }}
    >
      <input type="hidden" name="source" value={source ?? "footer"} />
      <Input type="email" name="email" placeholder="you@example.com" required className="bg-background" />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Joining…" : "Subscribe"}
      </Button>
    </form>
  );
}
