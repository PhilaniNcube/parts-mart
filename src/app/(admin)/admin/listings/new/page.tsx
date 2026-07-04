import { getVendorsForDropdown } from "@/features/admin/admin-queries";
import { getMakes, getPartTypes } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { createListingAction } from "@/features/listing/listing-actions";
import { ListingForm, type MakeOption, type PartTypeOption, type VendorOption } from "@/features/listing/components/listing-form";

export const metadata = { title: "New listing (admin) · PartsMart" };

export default async function AdminNewListingPage() {
  const [makes, partTypes, vendors] = (await Promise.all([
    getMakes(),
    getPartTypes(),
    getVendorsForDropdown(),
  ])) as [MakeOption[], PartTypeOption[], VendorOption[]];

  return (
    <div className="flex-1 p-6 md:p-10 mx-auto w-full max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground">New listing (admin)</h1>
      <ListingForm
        action={createListingAction}
        makes={makes}
        partTypes={partTypes}
        vendors={vendors}
        initial={{ vendorId: vendors[0]?.id }}
      />
    </div>
  );
}