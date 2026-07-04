import Link from "next/link";
import { getAllVendors } from "@/features/admin/admin-queries";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VendorStatusToggle } from "./vendor-status-toggle";
import { Store, UserCheck, Clock, CircleDollarSign } from "lucide-react";

export async function AdminVendors() {
  const vendors = await getAllVendors();
  const activeCount = vendors.filter(v => v.status === "active").length;
  const suspendedCount = vendors.filter(v => v.status === "suspended").length;

  return (
    <>
      {/* Stats Summary (Bento-lite) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-muted-foreground text-sm font-medium">Total Vendors</p>
            <Store className="h-4 w-4 text-primary opacity-70" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">{vendors.length}</h3>
          <p className="text-xs text-green-600 mt-2 font-medium">
            +12% from last month
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-muted-foreground text-sm font-medium">Active Sellers</p>
            <UserCheck className="h-4 w-4 text-primary opacity-70" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">{activeCount}</h3>
          <div className="w-full bg-muted h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: vendors.length ? `${(activeCount / vendors.length) * 100}%` : '0%' }}></div>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-muted-foreground text-sm font-medium">Suspended</p>
            <Clock className="h-4 w-4 text-destructive opacity-70" />
          </div>
          <h3 className="text-3xl font-bold text-destructive">{suspendedCount}</h3>
          <p className="text-xs text-muted-foreground mt-2 italic">Awaiting review</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-muted-foreground text-sm font-medium">Platform Activity</p>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground opacity-70" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">Active</h3>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-bold">System Status</p>
        </div>
      </div>

      {vendors.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground border-dashed border-2">
          <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No vendor accounts yet</h3>
          <p>When vendors sign up, they will appear here.</p>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Status Filter Tabs (Visual Only for MVP) */}
          <div className="flex items-center gap-2 p-2 border-b border-border overflow-x-auto no-scrollbar bg-muted/20">
            <div className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground shadow-sm">All</div>
            <div className="px-6 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">Active</div>
            <div className="px-6 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">Suspended</div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="uppercase text-xs tracking-wider py-4">Name</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider py-4">Business Name</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider py-4">Email</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider py-4 text-center">Listings</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider py-4 text-right">Status Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                          {v.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-medium text-muted-foreground">{v.businessName ?? "—"}</TableCell>
                    <TableCell className="py-4 text-muted-foreground font-mono text-sm">{v.email}</TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge variant="outline" className="bg-muted/50 font-bold">{v.listingCount}</Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <VendorStatusToggle vendorId={v.id} status={v.status as "active" | "suspended"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">
        Suspend a vendor to hide their listings from search and disable their dashboard.
        Manage their listings from the <Link href="/admin/listings" className="underline font-medium hover:text-primary">All Listings</Link> tab.
      </p>
    </>
  );
}

export function AdminVendorsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Bento summary skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="h-28 bg-muted rounded-xl" />
        <div className="h-28 bg-muted rounded-xl" />
        <div className="h-28 bg-muted rounded-xl" />
        <div className="h-28 bg-muted rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}
