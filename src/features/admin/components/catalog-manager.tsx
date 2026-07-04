import { getMakes } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { CatalogManagerClient, type MakeOption } from "./catalog-manager-client";

export async function CatalogManager() {
  const makesList = await getMakes();
  const makeOptions: MakeOption[] = makesList.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
  }));

  return <CatalogManagerClient makes={makeOptions} />;
}

export function CatalogManagerSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 animate-pulse">
      {/* Add Make Skeleton */}
      <div className="bg-card border border-border rounded-xl p-6 h-[260px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded-md w-1/3" />
          <div className="space-y-1.5 mt-4">
            <div className="h-4 bg-muted rounded-md w-1/4" />
            <div className="h-10 bg-muted rounded-md w-full" />
          </div>
        </div>
        <div className="h-10 bg-muted rounded-md w-full" />
      </div>

      {/* Add Model Skeleton */}
      <div className="bg-card border border-border rounded-xl p-6 h-[260px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded-md w-1/3" />
          <div className="space-y-1.5 mt-4">
            <div className="h-4 bg-muted rounded-md w-1/4" />
            <div className="h-10 bg-muted rounded-md w-full" />
          </div>
        </div>
        <div className="h-10 bg-muted rounded-md w-full" />
      </div>
    </div>
  );
}