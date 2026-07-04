import { getCurrentUser } from "@/features/auth/auth-queries";
import { getMakes, getPartTypes } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { createListingAction } from "@/features/listing/listing-actions";
import { ListingForm, type MakeOption, type PartTypeOption } from "@/features/listing/components/listing-form";

export const metadata = { title: "New listing · PartsMart" };

export default async function NewListingPage() {
  const user = await getCurrentUser();
  // vendor layout already gates role; admin creating on behalf of a vendor uses /admin/listings/new
  const makes = (await getMakes()) as MakeOption[];
  const partTypes = (await getPartTypes()) as PartTypeOption[];

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">New listing</h1>
      <ListingForm
        action={createListingAction}
        makes={makes}
        partTypes={partTypes}
        initial={{ vendorId: user!.id }}
      />
    </div>
  );
}