import { Suspense } from "react";
import { SearchFiltersForm, type SearchFormOption } from "./search-filters-form";
import { SearchResultsStreaming } from "./search-results";
import {
  getMakes,
  getModelsByMake,
  getPartTypes,
  getMakeBySlug,
} from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { SaveSearchButton } from "@/features/saved-search/components/save-search-button";
import type { SearchFilters } from "@/types";

export async function SearchInterface({ filters }: { filters: SearchFilters }) {
  const makes = (await getMakes()) as SearchFormOption[];
  const partTypes = (await getPartTypes()) as SearchFormOption[];
  const viewer = await getCurrentUser();
  const canSaveSearch = viewer?.role === "vendor" && viewer?.status === "active";

  let models: SearchFormOption[] = [];
  if (filters.make) {
    const mk = await getMakeBySlug(filters.make);
    if (mk) {
      models = (await getModelsByMake(mk.id)) as SearchFormOption[];
    }
  }

  return (
    <>
      <SearchFiltersForm
        makes={makes}
        models={models}
        partTypes={partTypes}
        filters={filters}
      />

      {canSaveSearch && (
        <div className="mt-4 mb-2 flex justify-end">
          <Suspense fallback={null}>
            <SaveSearchButton />
          </Suspense>
        </div>
      )}

      <div className="mt-12">
        <SearchResultsStreaming filters={filters} />
      </div>
    </>
  );
}

export function SearchInterfaceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Form filters skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-card rounded-2xl border border-border">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>

      {/* Results skeleton */}
      <div className="mt-12 space-y-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-muted rounded-2xl" />
          <div className="h-80 bg-muted rounded-2xl" />
          <div className="h-80 bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
