"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
          <h2>Application error</h2>
          <p style={{ color: "#666" }}>
            {error.digest ? `Reference: ${error.digest}` : "Please reload the page."}
          </p>
        </div>
      </body>
    </html>
  );
}