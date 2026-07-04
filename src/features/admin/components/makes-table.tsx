import Link from "next/link";
import { getCatalogTree } from "@/features/vehicle-catalog/vehicle-catalog-queries";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { deleteMakeAction } from "@/features/admin/admin-actions";
import { asFormAction } from "@/lib/form-action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export async function MakesTable() {
  const tree = await getCatalogTree();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">
                Make Name
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">
                Slug
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">
                Models Count
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tree.map((m) => (
              <TableRow key={m.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-primary font-mono text-sm shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-foreground text-base">{m.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 font-mono text-muted-foreground text-sm">
                  {m.slug}
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className="font-medium bg-secondary/50 text-secondary-foreground">
                    {m.models.length} model(s)
                  </Badge>
                  {m.models.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-1 max-w-[200px]">
                      {m.models.slice(0, 3).map((md) => (
                        <span key={md.id}>
                          {md.name}
                          {md.bodyStyle ? ` (${md.bodyStyle})` : ""}
                        </span>
                      ))}
                      {m.models.length > 3 && <span>+{m.models.length - 3} more</span>}
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/catalog/makes/${m.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit make ${m.name}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <form action={asFormAction(deleteMakeAction)}>
                      <input type="hidden" name="id" value={m.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete make ${m.name}`}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
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
  );
}

export function MakesTableSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-1/3">
                Make Name
              </TableHead>
              <TableHead className="py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-1/4">
                Slug
              </TableHead>
              <TableHead className="py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-1/4">
                Models Count
              </TableHead>
              <TableHead className="py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx} className="border-b border-border/50">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
                    <div className="h-5 bg-muted rounded-md w-24" />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="h-4 bg-muted rounded-md w-16" />
                </TableCell>
                <TableCell className="py-4">
                  <div className="h-5 bg-muted rounded-md w-20" />
                  <div className="h-3 bg-muted rounded-md w-28 mt-2" />
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 bg-muted rounded-md" />
                    <div className="w-8 h-8 bg-muted rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
