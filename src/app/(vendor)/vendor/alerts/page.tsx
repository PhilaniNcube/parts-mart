import Link from "next/link";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { getVendorSavedSearches } from "@/features/saved-search/saved-search-queries";
import { deleteSavedSearchAction } from "@/features/saved-search/saved-search-actions";
import { asFormAction } from "@/lib/form-action";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Bell, Car } from "lucide-react";

export const metadata = { title: "Alert subscriptions · PartsMart" };

export default async function VendorAlertsPage() {
  const user = await getCurrentUser();
  const searches = await getVendorSavedSearches(user!.id);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
      {/* Page Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-2">Saved search alerts</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Get notified when new listings match your criteria. We&apos;ll send an email the moment a matching part is posted.
          </p>
        </div>
        <Button asChild className="h-12 px-6 rounded-xl font-bold shadow-md gap-2 shrink-0">
          <Link href="/search">
            <Plus className="h-5 w-5" /> New alert
          </Link>
        </Button>
      </section>

      {searches.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No alerts yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Set up alerts by running a search for parts you need, then tapping &quot;Save this search as alert&quot; on the search page.
          </p>
          <Button asChild className="rounded-xl font-bold px-8">
            <Link href="/search">Find parts to track</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {searches.map((s) => (
            <div key={s.id} className="group relative bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{s.name}</h4>
                    <p className="text-sm text-muted-foreground">Alert subscription</p>
                  </div>
                </div>
                <form action={asFormAction(deleteSavedSearchAction)}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20 hover:text-destructive rounded-full transition-colors" aria-label="Delete alert">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </form>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {s.filters.q && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    <span className="text-xs opacity-60 mr-1">Keyword:</span> {s.filters.q}
                  </Badge>
                )}
                {s.filters.make && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    <span className="text-xs opacity-60 mr-1">Make:</span> {s.filters.make}
                  </Badge>
                )}
                {s.filters.model && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    <span className="text-xs opacity-60 mr-1">Model:</span> {s.filters.model}
                  </Badge>
                )}
                {s.filters.year && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    <span className="text-xs opacity-60 mr-1">Year:</span> {s.filters.year}
                  </Badge>
                )}
                {s.filters.partTypeId && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    <span className="text-xs opacity-60 mr-1">Part:</span> Specific Type
                  </Badge>
                )}
                {s.filters.partNumber && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    <span className="text-xs opacity-60 mr-1">Part #:</span> {s.filters.partNumber}
                  </Badge>
                )}
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-center mt-auto">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Active monitoring
                </span>
                <span className="text-sm text-primary font-bold">Email alerts ON</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}