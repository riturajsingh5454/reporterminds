"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordResetAction } from "@/server/actions/auth";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Alert>
        <AlertDescription>
          If an account exists with that email, a reset link is on its way.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        startTransition(async () => {
          await requestPasswordResetAction(formData);
          setSubmitted(true);
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending…" : "Send Reset Link"}
      </Button>
    </form>
  );
}
