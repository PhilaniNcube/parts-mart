import { getCatalogTree } from "@/features/vehicle-catalog/vehicle-catalog-queries";

export async function CatalogStats() {
  const tree = await getCatalogTree();
  const totalModels = tree.reduce((acc, m) => acc + m.models.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">Total Makes</span>
        <span className="text-3xl font-bold text-foreground">{tree.length}</span>
      </div>
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">Top Performer</span>
        <span className="text-3xl font-bold text-primary">Toyota</span>
      </div>
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">Active Listings</span>
        <span className="text-3xl font-bold text-foreground">12,490</span>
      </div>
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">Models Synced</span>
        <span className="text-3xl font-bold text-foreground">{totalModels}</span>
      </div>
    </div>
  );
}

export function CatalogStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="h-4 bg-muted rounded-md w-1/2 mb-3" />
          <div className="h-8 bg-muted rounded-md w-1/3" />
        </div>
      ))}
    </div>
  );
}
