import { Suspense } from "react";
import { SearchIcon } from "lucide-react";
import { ListingCard, ListingCardSkeleton } from "@/features/listing/components/listing-card";
import { searchListings, type SearchHit } from "@/features/search/search-queries";
import type { SearchFilters } from "@/types";

export async function SearchResults({ filters }: { filters: SearchFilters }) {
  const hits = await searchListings(filters);

  if (!hits.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <SearchIcon className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-3 text-lg font-semibold">No parts found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try widening your filters — clear the make/model, use part of the part number, or broaden the year.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hits.map((hit) => (
        <ListingCard key={hit.id} hit={hit} />
      ))}
    </div>
  );
}

export function SearchResultsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SearchResultsStreaming({ filters }: { filters: SearchFilters }) {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResults filters={filters} />
    </Suspense>
  );
}

export type { SearchHit };