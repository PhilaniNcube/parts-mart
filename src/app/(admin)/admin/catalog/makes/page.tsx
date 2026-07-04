import { Suspense } from "react";
import { CatalogStats, CatalogStatsSkeleton } from "@/features/admin/components/catalog-stats";
import { CatalogManager, CatalogManagerSkeleton } from "@/features/admin/components/catalog-manager";
import { MakesTable, MakesTableSkeleton } from "@/features/admin/components/makes-table";

export const metadata = { title: "Catalog · PartsMart admin" };

export default function AdminCatalogMakesPage() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Vehicle makes</h1>
          <p className="text-lg text-muted-foreground">
            Configure and manage automotive manufacturer catalog entries.
          </p>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <Suspense fallback={<CatalogStatsSkeleton />}>
        <CatalogStats />
      </Suspense>

      {/* Catalog Manager (Add Make/Model Forms) */}
      <div className="mb-12">
        <Suspense fallback={<CatalogManagerSkeleton />}>
          <CatalogManager />
        </Suspense>
      </div>

      {/* Table Container */}
      <Suspense fallback={<MakesTableSkeleton />}>
        <MakesTable />
      </Suspense>
    </div>
  );
}