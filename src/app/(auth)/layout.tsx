import Link from "next/link";
import { Feather } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-6 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Feather className="text-primary size-5" />
        <span className="font-display text-lg tracking-tight">ReportersMind</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
