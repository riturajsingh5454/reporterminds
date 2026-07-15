"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function resolveFileUrl(url: string): string {
  return url.includes("drive.google.com") ? `/api/drive-file?url=${encodeURIComponent(url)}` : url;
}

const MAX_PAGE_WIDTH = 720;

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [pageWidth, setPageWidth] = useState(MAX_PAGE_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setPageWidth(Math.min(MAX_PAGE_WIDTH, entry.contentRect.width));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const fileUrl = resolveFileUrl(url);

  if (failed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-12 text-center">
        <AlertTriangle className="text-muted-foreground size-8" />
        <p className="text-muted-foreground text-sm">This document could not be loaded.</p>
        <Button variant="outline" size="sm" render={<a href={url} target="_blank" rel="noreferrer" />}>
          <Download className="size-3.5" /> Open original
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-h-[80vh] w-full overflow-y-auto rounded-lg border border-border/60 bg-secondary/20 p-2 sm:p-4"
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={() => setFailed(true)}
        loading={
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading document…
          </div>
        }
        className="flex flex-col items-center gap-4"
      >
        {numPages
          ? Array.from({ length: numPages }, (_, i) => (
              <Page key={i + 1} pageNumber={i + 1} width={pageWidth} className="max-w-full" />
            ))
          : null}
      </Document>
    </div>
  );
}
