import Link from "next/link";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { getVendorNotifications } from "@/features/saved-search/saved-search-queries";
import { markNotificationReadAction } from "@/features/saved-search/saved-search-actions";
import { asFormAction } from "@/lib/form-action";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/types";
import { Check, Bell, Car } from "lucide-react";

export const metadata = { title: "Notifications · PartsMart" };

export default async function VendorNotificationsPage() {
  const user = await getCurrentUser();
  const notifications = await getVendorNotifications(user!.id);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
        <p className="text-lg text-muted-foreground">Stay updated with your latest alerts and matches.</p>
      </header>

      {notifications.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">You&apos;re all caught up!</h3>
          <p className="text-muted-foreground">
            No matches yet. You&apos;ll see new listings that match your saved searches here, and get an email too.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`relative bg-card border ${n.readAt ? 'border-border opacity-80' : 'border-primary shadow-sm'} p-6 rounded-xl flex flex-col md:flex-row md:items-center gap-6 group hover:bg-muted/30 transition-all`}
            >
              {!n.readAt && (
                <div className="absolute top-6 left-6 w-3 h-3 bg-primary rounded-full animate-pulse -ml-2 -mt-2"></div>
              )}
              
              <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                <Car className={`h-8 w-8 ${n.readAt ? 'text-muted-foreground' : 'text-primary'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${n.readAt ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'}`}>
                    Match Found
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Alert match
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">
                  <Link href={`/listings/${n.listingId}`} className="hover:underline">{n.title}</Link>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Part #: {n.partNumber} · Vendor: {n.businessName ?? n.vendorName}
                </p>
              </div>
              
              <div className="text-right flex flex-col items-end md:items-end md:justify-center">
                <p className={`text-xl font-bold ${n.readAt ? 'text-foreground' : 'text-primary'}`}>
                  {formatPrice(n.priceCents)}
                </p>
                {n.readAt ? (
                  <Button asChild variant="link" className="mt-2 text-muted-foreground p-0 h-auto font-medium">
                    <Link href={`/listings/${n.listingId}`}>View Listing</Link>
                  </Button>
                ) : (
                  <form action={asFormAction(markNotificationReadAction)} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="id" value={n.id} />
                    <Button type="submit" variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                      <Check className="h-4 w-4 mr-1" /> Mark read
                    </Button>
                    <Button asChild variant="link" className="text-primary p-0 h-auto font-medium">
                      <Link href={`/listings/${n.listingId}`}>View Listing</Link>
                    </Button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}