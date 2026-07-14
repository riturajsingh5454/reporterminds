"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function getGoogleDriveEmbedUrl(url: string): string | null {
  const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.match(/[?&]id=([^&]+)/)?.[1];
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [failed, setFailed] = useState(false);

  const driveEmbedUrl = url.includes("drive.google.com") ? getGoogleDriveEmbedUrl(url) : null;

  if (driveEmbedUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-border/60 bg-secondary/20">
        <iframe
          src={driveEmbedUrl}
          title="Document preview"
          className="h-[700px] w-full"
          allow="autoplay"
        />
      </div>
    );
  }

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
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={() => setFailed(true)}
        loading={
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading document…
          </div>
        }
      >
        <Page pageNumber={page} width={720} />
      </Document>

      {numPages ? (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} of {numPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= numPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
