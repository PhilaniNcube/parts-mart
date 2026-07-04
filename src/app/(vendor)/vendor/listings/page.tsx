import Link from "next/link";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { getVendorListings } from "@/features/listing/listing-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatPrice, formatYears } from "@/types";
import { Pencil, Plus, Wrench } from "lucide-react";
import { DeleteListingButton } from "@/features/listing/components/delete-listing-button";

export const metadata = { title: "My listings · PartsMart" };

export default async function VendorListingsPage() {
  const user = await getCurrentUser();
  const listings = await getVendorListings(user!.id);
  
  const totalValue = listings.reduce((acc, l) => acc + (l.priceCents * l.stock), 0);
  const totalStock = listings.reduce((acc, l) => acc + l.stock, 0);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Your listings</h1>
          <p className="text-lg text-muted-foreground">Overview of your current automotive parts inventory on PartsMart.</p>
        </div>
        <Button asChild className="h-12 px-6 rounded-xl font-bold gap-2">
          <Link href="/vendor/listings/new">
            <Plus className="h-5 w-5" /> New listing
          </Link>
        </Button>
      </div>

      {/* Stats Summary (Bento-lite) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <p className="text-muted-foreground text-xs uppercase font-medium">Active Listings</p>
          <p className="text-primary text-3xl font-bold mt-1">{listings.length}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <p className="text-muted-foreground text-xs uppercase font-medium">Total Stock Items</p>
          <p className="text-foreground text-3xl font-bold mt-1">{totalStock}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm md:col-span-1 col-span-2">
          <p className="text-muted-foreground text-xs uppercase font-medium">Total Value</p>
          <p className="text-foreground text-3xl font-bold mt-1">{formatPrice(totalValue)}</p>
        </div>
      </div>

      {listings.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No listings yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You haven&apos;t added any parts to your inventory. Add your first listing to start selling.
          </p>
          <Button asChild className="rounded-xl font-bold px-8">
            <Link href="/vendor/listings/new">Add your first part</Link>
          </Button>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16 uppercase text-xs tracking-wider">Thumbnail</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider">Title / Part Type</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider">Make/Model/Year</TableHead>
                  <TableHead className="text-right uppercase text-xs tracking-wider">Price</TableHead>
                  <TableHead className="text-center uppercase text-xs tracking-wider">Status</TableHead>
                  <TableHead className="text-right uppercase text-xs tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((l) => (
                  <TableRow key={l.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-muted/50 overflow-hidden border border-border flex items-center justify-center">
                        {l.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.imageUrl} alt={l.title} className="w-full h-full object-cover" />
                        ) : (
                          <Wrench className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/listings/${l.id}`} className="font-bold text-base text-foreground hover:text-primary transition-colors block truncate max-w-[200px] sm:max-w-xs">{l.title}</Link>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {l.partTypeName} <span className="text-xs ml-2 opacity-50 font-mono">#{l.partNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {l.makeName ?? "Universal"}{l.modelName ? ` / ${l.modelName}` : ""}{l.years && l.years.length > 0 ? ` / ${formatYears(l.years)}` : ""}
                    </TableCell>
                    <TableCell className="text-right text-primary font-bold text-base">
                      {formatPrice(l.priceCents)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={l.stock > 0 ? "success" : "secondary"} className="uppercase font-bold tracking-wider text-[10px]">
                        {l.stock > 0 ? "Active" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm" className="h-9 px-3 rounded-lg" aria-label="Edit listing">
                          <Link href={`/vendor/listings/${l.id}/edit`}><Pencil className="h-4 w-4 mr-2" /> Edit</Link>
                        </Button>
                        <DeleteListingButton id={l.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

// Needed to silence the unused import in the original file
import { Package } from "lucide-react";