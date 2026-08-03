"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function resolveFileUrl(url: string): string {
  return url.includes("drive.google.com") ? `/api/drive-file?url=${encodeURIComponent(url)}` : url;
}

const MAX_PAGE_WIDTH = 720;

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
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
          <FileText className="size-3.5" /> View original document
        </Button>
      </div>
    );
  }

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages ?? 1, p + 1));

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg border border-border/60 bg-secondary/20 p-2 sm:p-4 flex flex-col items-center gap-4"
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setPageNumber(1);
        }}
        onLoadError={() => setFailed(true)}
        loading={
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading document…
          </div>
        }
        className="flex flex-col items-center gap-4 w-full"
      >
        {numPages ? (
          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            width={pageWidth}
            className="max-w-full rounded-md shadow-md overflow-hidden bg-white"
          />
        ) : null}
      </Document>

      {numPages && numPages > 0 ? (
        <div className="flex w-full items-center justify-between border-t border-border/60 pt-3 text-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={pageNumber <= 1}
            aria-label="Previous Page"
          >
            <ChevronLeft className="size-4 mr-1" /> Previous
          </Button>

          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            Page {pageNumber} of {numPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            aria-label="Next Page"
          >
            Next <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
