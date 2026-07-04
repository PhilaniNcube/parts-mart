import { notFound } from "next/navigation";
import { getRawListingById } from "@/features/listing/listing-queries";
import { getMakes, getPartTypes } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { getVendorsForDropdown } from "@/features/admin/admin-queries";
import { updateListingAction } from "@/features/listing/listing-actions";
import { ListingForm, type ListingFormInitial, type MakeOption, type PartTypeOption, type VendorOption } from "./listing-form";

export async function AdminEditListing({ id }: { id: string }) {
  const raw = await getRawListingById(id);
  if (!raw) notFound();

  const [makes, partTypes, vendors] = (await Promise.all([
    getMakes(),
    getPartTypes(),
    getVendorsForDropdown(),
  ])) as [MakeOption[], PartTypeOption[], VendorOption[]];

  const initial: ListingFormInitial = {
    id: raw.id,
    vendorId: raw.vendorId,
    partTypeId: raw.partTypeId,
    makeId: raw.makeId ?? undefined,
    modelId: raw.modelId ?? undefined,
    years: raw.years,
    title: raw.title,
    description: raw.description ?? "",
    partNumber: raw.partNumber,
    sku: raw.sku,
    condition: raw.condition,
    priceRands: String(raw.priceCents / 100),
    stock: String(raw.stock),
    imageUrl: raw.imageUrl ?? "",
  };

  return (
    <ListingForm action={updateListingAction} makes={makes} partTypes={partTypes} vendors={vendors} initial={initial} />
  );
}

export function AdminEditListingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-32 bg-muted rounded" />
      </div>
      <div className="h-10 w-28 bg-muted rounded" />
    </div>
  );
}
