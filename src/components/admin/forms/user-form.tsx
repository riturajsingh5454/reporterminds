"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@prisma/client";
import { createUser, updateUser } from "@/server/actions/users";
import type { ActionResult } from "@/server/actions/books";

export function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result: ActionResult = user ? await updateUser(user.id, formData) : await createUser(formData);
      if (result.success) {
        toast.success(user ? "User updated." : "User created.");
        router.push("/admin/users");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={user?.email} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{user ? "New Password (leave blank to keep current)" : "Password"}</Label>
            <Input id="password" name="password" type="password" required={!user} minLength={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user?.role ?? "EDITOR"}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={user?.bio ?? ""} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="isActive" name="isActive" defaultChecked={user?.isActive ?? true} />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : user ? "Save Changes" : "Create User"}
      </Button>
    </form>
  );
}
