import { Suspense } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminVendors, AdminVendorsSkeleton } from "@/features/admin/components/admin-vendors";
import { CreateVendorSheet } from "@/features/admin/components/create-vendor-sheet";

export const metadata = { title: "Vendors · PartsMart admin" };

export default function AdminVendorsPage() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Vendors</h1>
          <p className="text-lg text-muted-foreground">Manage marketplace sellers and business accounts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-4 rounded-xl font-bold gap-2 text-primary border-primary/20 hover:bg-primary/5">
            <Download className="h-5 w-5" /> Export
          </Button>
          <CreateVendorSheet />
        </div>
      </div>

      <Suspense fallback={<AdminVendorsSkeleton />}>
        <AdminVendors />
      </Suspense>
    </div>
  );
}