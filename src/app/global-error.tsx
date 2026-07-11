"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Something went wrong</h2>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p style={{ color: "#999", fontSize: "0.75rem" }}>Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1.5rem",
            background: "#1a4d2e",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
