"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const PdfViewerLazy = dynamic(() => import("@/components/shared/pdf-viewer").then((m) => m.PdfViewer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-border/60 py-20 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> Loading viewer…
    </div>
  ),
});
