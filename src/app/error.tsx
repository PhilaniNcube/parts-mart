"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred while rendering this page. You can try again, or head back to search.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">ref: {error.digest}</p>
      )}
      <div className="mt-6 flex gap-2">
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button asChild variant="outline">
          <a href="/search">Back to search</a>
        </Button>
      </div>
    </div>
  );
}