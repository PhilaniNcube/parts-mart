import Link from "next/link";
import { Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That route doesn’t exist or has moved. Try the search to find parts.
      </p>
      <div className="mt-6 flex gap-2">
        <Button asChild className="gap-2">
          <Link href="/search"><Search className="h-4 w-4" /> Go to search</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}