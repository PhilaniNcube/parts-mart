import Link from "next/link";
import { Package, Plus, Search, Handshake } from "lucide-react";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { getVendorListings } from "@/features/listing/listing-queries";
import { db } from "@/db";
import { savedSearch, inAppNotification } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/features/listing/components/listing-card";

export const metadata = { title: "Vendor dashboard · PartsMart" };

export default async function VendorDashboardPage() {
  const user = await getCurrentUser();
  const listings = await getVendorListings(user!.id);
  const alerts = await db.select({ c: count() }).from(savedSearch).where(eq(savedSearch.vendorId, user!.id));
  const unread = await db
    .select({ c: count() })
    .from(inAppNotification)
    .where(eq(inAppNotification.vendorId, user!.id));

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {user!.businessName ?? user!.name}
          </h1>
          <p className="text-lg text-muted-foreground">Vendor dashboard</p>
        </div>
        <Button asChild className="h-12 px-6 rounded-xl font-bold gap-2">
          <Link href="/vendor/listings/new">
            <Plus className="h-5 w-5" /> New listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Stat 
          icon={<Package className="h-8 w-8" />} 
          label="Active Listings" 
          value={listings.length} 
          href="/vendor/listings" 
          iconClass="text-primary bg-primary/10"
        />
        <Stat 
          icon={<Search className="h-8 w-8" />} 
          label="Saved search alerts" 
          value={Number(alerts[0]?.c ?? 0)} 
          href="/vendor/alerts" 
          iconClass="text-orange-500 bg-orange-500/10"
        />
        <Stat 
          icon={<Handshake className="h-8 w-8" />} 
          label="New Matches" 
          value={Number(unread[0]?.c ?? 0)} 
          href="/vendor/notifications" 
          iconClass="text-green-500 bg-green-500/10"
        />
      </div>

      {/* Listings Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Your latest listings</h3>
          <Button asChild variant="link" className="text-primary font-bold">
            <Link href="/vendor/listings">View all</Link>
          </Button>
        </div>
        {listings.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 3).map((h) => <ListingCard key={h.id} hit={h} />)}
          </div>
        ) : (
          <Card className="mt-3">
            <CardHeader>
              <CardTitle>No listings yet</CardTitle>
              <CardDescription>Add your first part to start selling.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild><Link href="/vendor/listings/new">Create a listing</Link></Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, href, iconClass }: { icon: React.ReactNode; label: string; value: number; href: string, iconClass: string }) {
  return (
    <Link href={href} className="group">
      <div className="p-6 bg-card border border-border rounded-xl flex items-center gap-5 hover:shadow-md transition-shadow h-full">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1 font-medium">{label}</p>
          <h2 className="text-3xl font-bold text-foreground">{value}</h2>
        </div>
      </div>
    </Link>
  );
}