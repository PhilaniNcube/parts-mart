import Link from "next/link";
import { Wrench, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatYears } from "@/types";
import type { SearchHit } from "@/features/search/search-queries";

export function ListingCard({ hit }: { hit: SearchHit }) {
  const inStock = hit.stock > 0;
  return (
    <Link href={`/listings/${hit.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3] w-full bg-muted">
          {hit.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hit.imageUrl} alt={hit.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Wrench className="h-10 w-10" />
            </div>
          )}
          <Badge
            variant={inStock ? "success" : "secondary"}
            className="absolute right-2 top-2"
          >
            {inStock ? `${hit.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase text-muted-foreground">{hit.partTypeName}</span>
            <Badge variant="outline" className="capitalize">{hit.condition}</Badge>
          </div>
          <h3 className="mt-1 line-clamp-2 font-semibold leading-tight">{hit.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {hit.makeName ?? "Universal"} {hit.modelName ? `· ${hit.modelName}` : ""} {hit.years && hit.years.length > 0 ? `· ${formatYears(hit.years)}` : ""}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-semibold">{formatPrice(hit.priceCents)}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShoppingCart className="h-3.5 w-3.5" />
              {hit.businessName ?? hit.vendorName}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-[4/3] w-full bg-muted" />
      <CardContent className="p-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="mt-3 h-5 w-1/3 rounded bg-muted" />
      </CardContent>
    </Card>
  );
}