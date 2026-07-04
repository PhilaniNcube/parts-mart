import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Filter, UserPlus } from "lucide-react";
import { AdminCustomers, AdminCustomersSkeleton } from "@/features/admin/components/admin-customers";

export const metadata = { title: "Customers · PartsMart admin" };

export default function AdminCustomersPage() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Customers</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Oversee your marketplace community. Review user profiles, track engagement metrics, and manage account statuses from this centralized dashboard.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-4 rounded-xl font-bold gap-2">
            <Filter className="h-5 w-5" /> Filter
          </Button>
          <Button className="h-11 px-6 rounded-xl font-bold gap-2 shadow-sm pointer-events-none opacity-50">
            <UserPlus className="h-5 w-5" /> Add User
          </Button>
        </div>
      </div>

      <Suspense fallback={<AdminCustomersSkeleton />}>
        <AdminCustomers />
      </Suspense>
    </div>
  );
}