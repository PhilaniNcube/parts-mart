import { Skeleton } from "@/components/ui/skeleton";

export default function ListingDetailLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="mb-4 h-8 w-32" />
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-2 h-10 w-24" />
          <Skeleton className="mt-4 h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}