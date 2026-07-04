import { Suspense } from "react";
import { AdminEditListing, AdminEditListingSkeleton } from "@/features/listing/components/admin-edit-listing";

export const metadata = { title: "Edit listing (admin) · PartsMart" };

export default function AdminEditListingPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex-1 p-6 md:p-10 mx-auto w-full max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground">Edit listing (admin)</h1>
      <Suspense fallback={<AdminEditListingSkeleton />}>
        {params.then(({ id }) => (
          <AdminEditListing id={id} />
        ))}
      </Suspense>
    </div>
  );
}