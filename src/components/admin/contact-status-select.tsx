"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateContactRequestStatus } from "@/server/actions/contact-requests";

export function ContactStatusSelect({ id, status }: { id: string; status: "NEW" | "IN_PROGRESS" | "RESOLVED" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          const result = await updateContactRequestStatus(id, value as "NEW" | "IN_PROGRESS" | "RESOLVED");
          if (result.success) {
            toast.success("Status updated.");
            router.refresh();
          } else {
            toast.error(result.error ?? "Failed to update status.");
          }
        });
      }}
    >
      <SelectTrigger size="sm" className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NEW">New</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
        <SelectItem value="RESOLVED">Resolved</SelectItem>
      </SelectContent>
    </Select>
  );
}
