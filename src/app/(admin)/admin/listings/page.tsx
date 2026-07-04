import { getAllListings, conditionLabel } from "@/features/listing/listing-queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { formatPrice, formatYears } from "@/types";
import { DeleteListingButton } from "@/features/listing/components/delete-listing-button";

export const metadata = { title: "All listings · PartsMart admin" };

export default async function AdminListingsPage() {
  const listings = await getAllListings();
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">All listings</h1>
          <p className="text-lg text-muted-foreground">Manage and oversee marketplace listings.</p>
        </div>
        <Button asChild className="h-11 px-6 rounded-xl font-bold gap-2 shadow-sm">
          <Link href="/admin/listings/new">New listing</Link>
        </Button>
      </div>
      {listings.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No listings on the marketplace yet.</Card>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Title</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Vendor</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Part #</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 text-right">Price</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 text-center">Stock</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {listings.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Link href={`/listings/${l.id}`} className="font-medium hover:underline">{l.title}</Link>
                    <div className="text-xs text-muted-foreground">
                      {l.makeName ?? "Universal"}{l.modelName ? ` · ${l.modelName}` : ""}{l.years && l.years.length > 0 ? ` · ${formatYears(l.years)}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>{l.businessName ?? l.vendorName}</TableCell>
                  <TableCell className="font-mono text-xs">{l.partNumber}</TableCell>
                  <TableCell className="text-right">{formatPrice(l.priceCents)}</TableCell>
                  <TableCell className="text-center"><Badge variant={l.stock > 0 ? "success" : "secondary"}>{l.stock > 0 ? l.stock : "Out"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon" aria-label="Edit listing">
                      <Link href={`/admin/listings/${l.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <DeleteListingButton id={l.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{listings.length} listing(s). {conditionLabel("new")} is the default condition.</p>
    </div>
  );
}