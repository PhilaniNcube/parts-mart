import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ListingDetail, ListingDetailSkeleton } from "@/features/listing/components/listing-detail";

export const metadata = { title: "Listing · PartsMart" };

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link href="/search" className="hover:text-primary transition-colors">Search</Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-foreground font-medium">Listing</span>
      </nav>

      <Suspense fallback={<ListingDetailSkeleton />}>
        {params.then(({ id }) => (
          <ListingDetail id={id} />
        ))}
      </Suspense>
    </div>
  );
}