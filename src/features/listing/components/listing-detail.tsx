import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ShieldCheck, Wrench, Store, Mail } from "lucide-react";
import { getListingById } from "../listing-queries";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatYears } from "@/types";

export async function ListingDetail({ id }: { id: string }) {
  const listing = await getListingById(id);
  if (!listing) notFound();
  const user = await getCurrentUser();
  const canEdit = user?.role === "admin" || (user?.role === "vendor" && user?.id === listing.vendorId);

  const conditionLabel = { new: "New", remanufactured: "Remanufactured", used: "Used", refurbished: "Refurbished" }[listing.condition];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-square bg-muted/50 rounded-2xl overflow-hidden border border-border relative group">
          {listing.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.imageUrl} alt={listing.title} className="h-full w-full object-contain p-8" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Wrench className="h-24 w-24 opacity-20" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-2 shadow-sm border border-border">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {listing.stock > 0 ? `${listing.stock} In Stock` : "Out of Stock"}
          </div>
        </div>
      </div>

      {/* Right Column: Product Details */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        {/* Header Info */}
        <div className="space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
            {listing.partTypeName}
          </span>
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{listing.title}</h1>
            {canEdit && (
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href={user?.role === "admin" ? `/admin/listings/${listing.id}/edit` : `/vendor/listings/${listing.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Link>
              </Button>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-bold text-primary">{formatPrice(listing.priceCents)}</span>
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <SpecCard label="Make" value={listing.makeName ?? "Universal"} />
          <SpecCard label="Model" value={listing.modelName ?? "Any"} />
          <SpecCard label="Year" value={listing.years && listing.years.length > 0 ? formatYears(listing.years) : "Any"} />
          <div className="p-4 bg-muted/30 rounded-xl border border-border">
            <p className="text-muted-foreground text-xs uppercase font-medium mb-1">Condition</p>
            <Badge variant="secondary" className="uppercase font-bold">{conditionLabel}</Badge>
          </div>
          <SpecCard label="Part Number" value={listing.partNumber || "N/A"} className="col-span-2" />
        </div>

        {/* Vendor Card */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">{listing.businessName ?? listing.vendorName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                Verified Vendor {listing.city ? `· ${listing.city}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full h-14 rounded-xl font-bold text-lg gap-2">
            <Mail className="h-5 w-5" />
            Contact Vendor
          </Button>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="space-y-4 border-t border-border pt-8 mt-2">
            <h3 className="text-2xl font-bold">Description</h3>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`p-4 bg-muted/30 rounded-xl border border-border ${className}`}>
      <p className="text-muted-foreground text-xs uppercase font-medium mb-1">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function ListingDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-square bg-muted rounded-2xl border border-border" />
      </div>

      {/* Right Column: Product Details */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="space-y-4">
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded mt-4" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl col-span-2" />
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>

        <div className="h-14 bg-muted rounded-xl w-full" />

        <div className="space-y-4 border-t border-border pt-8 mt-2">
          <div className="h-8 w-36 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/5 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
