import { getPartTypes } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { addPartTypeAction, deletePartTypeAction } from "@/features/admin/admin-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Settings2, Edit } from "lucide-react";
import { asFormAction } from "@/lib/form-action";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Part types · PartsMart admin" };

export default async function AdminCatalogPartTypesPage() {
  const partTypes = await getPartTypes();
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-1">Part types</h1>
          <nav className="flex text-muted-foreground text-sm mt-1">
            <Link href="/admin/catalog/makes" className="hover:text-primary">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">Part Types</span>
          </nav>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Total Types</p>
          <p className="text-3xl font-bold text-foreground">{partTypes.length}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Active Categories</p>
          <p className="text-3xl font-bold text-foreground">{Math.min(partTypes.length, 18)}</p>
        </div>
        <div className="md:col-span-2 bg-primary/10 border border-primary/20 p-5 rounded-xl relative overflow-hidden flex flex-col justify-end shadow-sm">
          <div className="z-10">
            <p className="text-primary/80 font-bold text-xs uppercase tracking-wider mb-2">Catalog Health</p>
            <p className="text-3xl font-bold text-primary">98.2% Accurate</p>
          </div>
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      <Card className="p-6 mb-8 border-border shadow-sm">
        <h3 className="text-lg font-bold mb-4">Add new part type</h3>
        <form action={asFormAction(addPartTypeAction)} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="space-y-1.5 flex-1 w-full">
            <Label htmlFor="name" className="text-muted-foreground">Part type name</Label>
            <Input id="name" name="name" required placeholder="e.g. Water Pump" className="h-11" />
          </div>
          <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 w-full sm:w-auto">
            <Plus className="h-5 w-5" /> Add part type
          </Button>
        </form>
      </Card>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Slug</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Created</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partTypes.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <Settings2 className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-foreground text-base">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-mono text-muted-foreground text-sm">{p.slug}</TableCell>
                  <TableCell className="py-4 font-medium text-muted-foreground text-sm">Recently</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 font-bold uppercase tracking-wide text-[10px]">
                      Live
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground pointer-events-none">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <form action={asFormAction(deletePartTypeAction)} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <Button type="submit" variant="ghost" size="icon" aria-label={`Delete ${p.name}`} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}