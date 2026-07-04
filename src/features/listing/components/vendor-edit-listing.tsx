import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { getRawListingById } from "@/features/listing/listing-queries";
import { getMakes, getPartTypes } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { updateListingAction } from "@/features/listing/listing-actions";
import { ListingForm, type ListingFormInitial, type MakeOption, type PartTypeOption } from "./listing-form";

export async function VendorEditListing({ id }: { id: string }) {
  const user = await getCurrentUser();
  const raw = await getRawListingById(id);
  if (!raw) notFound();
  if (user!.role === "vendor" && raw.vendorId !== user!.id) redirect("/vendor/listings");

  const makes = (await getMakes()) as MakeOption[];
  const partTypes = (await getPartTypes()) as PartTypeOption[];

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
    <ListingForm action={updateListingAction} makes={makes} partTypes={partTypes} initial={initial} />
  );
}

export function VendorEditListingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
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
