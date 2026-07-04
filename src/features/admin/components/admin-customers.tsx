import { getAllCustomers } from "@/features/admin/admin-queries";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, ShoppingCart, Search, MoreVertical } from "lucide-react";

export async function AdminCustomers() {
  const customers = await getAllCustomers();

  return (
    <>
      {/* Stats Overview (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-sm">
          <div className="z-10">
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-1">Total Active</p>
            <h3 className="text-4xl font-bold text-foreground">{customers.length}</h3>
          </div>
          <Users className="absolute -bottom-4 -right-4 h-24 w-24 text-muted-foreground/10" />
        </div>
        <div className="bg-secondary/10 border border-secondary/20 p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-sm">
          <div className="z-10">
            <p className="text-secondary-foreground font-bold text-xs uppercase tracking-wider mb-1">New this month</p>
            <h3 className="text-4xl font-bold text-secondary-foreground">
              +{customers.length > 0 ? Math.max(1, Math.floor(customers.length * 0.2)) : 0}
            </h3>
          </div>
          <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 text-secondary-foreground/10" />
        </div>
        <div className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden shadow-sm">
          <div className="z-10">
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-1">Conversion Rate</p>
            <h3 className="text-4xl font-bold text-foreground">3.2%</h3>
          </div>
          <ShoppingCart className="absolute -bottom-4 -right-4 h-24 w-24 text-muted-foreground/10" />
        </div>
      </div>

      {customers.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground border-dashed border-2">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No customer accounts yet</h3>
          <p>Searching is public, so customers only sign up if they choose to.</p>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-12">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input 
                className="w-full bg-background border border-input rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                placeholder="Search by name or email..." 
                type="text"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider py-4">Name</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider py-4">Email</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider py-4">Joined Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground tracking-wider py-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm shrink-0">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">South Africa</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground font-mono text-sm">{c.email}</TableCell>
                    <TableCell className="py-4 text-muted-foreground font-medium text-sm">
                      {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary pointer-events-none">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

export function AdminCustomersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Bento skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}
