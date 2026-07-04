import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchInterface, SearchInterfaceSkeleton } from "@/features/search/components/search-interface";
import type { SearchFilters } from "@/types";

export const metadata: Metadata = { title: "Search parts · PartsMart" };

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-foreground">Find car parts</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Filter by make, model, year and part number across all active vendors. Partial matches welcome — describe what
          you need.
        </p>
      </div>

      <Suspense fallback={<SearchInterfaceSkeleton />}>
        {searchParams.then((sp) => {
          const filters: SearchFilters = {
            q: str(sp.q),
            make: str(sp.make),
            model: str(sp.model),
            year: str(sp.year),
            partTypeId: str(sp.partTypeId),
            partNumber: str(sp.partNumber),
          };
          return <SearchInterface filters={filters} />;
        })}
      </Suspense>
    </div>
  );
}