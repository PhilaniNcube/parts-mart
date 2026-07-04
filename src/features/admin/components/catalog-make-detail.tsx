import { notFound } from "next/navigation";
import { getMakeById, getModelsByMake } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { CatalogMakeClient } from "./catalog-make-client";

interface AdminMakeDetailProps {
  id: string;
}

export async function AdminMakeDetail({ id }: AdminMakeDetailProps) {
  const make = await getMakeById(id);
  if (!make) {
    notFound();
  }

  const models = await getModelsByMake(id);

  return <CatalogMakeClient make={make} initialModels={models} />;
}

export function AdminMakeDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header section skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-10 bg-muted rounded-xl w-64" />
        <div className="h-6 bg-muted rounded-xl w-96" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 h-[260px] bg-muted rounded-xl" />
        <div className="lg:col-span-2 h-[450px] bg-muted rounded-xl" />
      </div>
    </div>
  );
}
