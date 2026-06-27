import type { Metadata } from "next";
import { UserForm } from "@/components/admin/forms/user-form";

export const metadata: Metadata = { title: "New User" };

export default function NewUserPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">New User</h1>
        <p className="text-muted-foreground text-sm">Create a new admin or editor account.</p>
      </div>
      <UserForm />
    </div>
  );
}
