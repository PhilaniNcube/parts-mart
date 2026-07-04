import { Suspense } from "react";
import { VendorEditListing, VendorEditListingSkeleton } from "@/features/listing/components/vendor-edit-listing";

export const metadata = { title: "Edit listing · PartsMart" };

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Edit listing</h1>
      <Suspense fallback={<VendorEditListingSkeleton />}>
        {params.then(({ id }) => (
          <VendorEditListing id={id} />
        ))}
      </Suspense>
    </div>
  );
}