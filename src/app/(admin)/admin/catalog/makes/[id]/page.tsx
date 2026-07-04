import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AdminMakeDetail, AdminMakeDetailSkeleton } from "@/features/admin/components/catalog-make-detail";

export const metadata = { title: "Manage Make · PartsMart admin" };

export default function AdminMakePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href="/admin/catalog/makes" className="hover:text-primary transition-colors">Catalog</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium">Manage Make</span>
      </nav>

      <Suspense fallback={<AdminMakeDetailSkeleton />}>
        {params.then(({ id }) => (
          <AdminMakeDetail id={id} />
        ))}
      </Suspense>
    </div>
  );
}