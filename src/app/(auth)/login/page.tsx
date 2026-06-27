import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
        <CardDescription>Sign in to manage ReportersMind content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
