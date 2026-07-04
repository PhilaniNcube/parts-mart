import { Package, Users, LifeBuoy, Bell, Store, TrendingUp, Minus } from "lucide-react";
import { getAdminMetrics } from "@/features/admin/admin-queries";
import Link from "next/link";

export const metadata = { title: "Admin overview · PartsMart" };

export default async function AdminOverviewPage() {
  const m = await getAdminMetrics();

  const stats = [
    { 
      icon: <Store className="h-6 w-6 text-primary" />, 
      label: "Total Vendors", 
      value: m.vendorCount, 
      href: "/admin/vendors",
      iconClass: "bg-primary/10",
      trend: "+12%",
      trendIcon: <TrendingUp className="h-3 w-3" />,
      trendColor: "text-green-600"
    },
    { 
      icon: <Users className="h-6 w-6 text-primary" />, 
      label: "Total Customers", 
      value: m.customerCount, 
      href: "/admin/customers",
      iconClass: "bg-primary/10",
      trend: "+8%",
      trendIcon: <TrendingUp className="h-3 w-3" />,
      trendColor: "text-green-600"
    },
    { 
      icon: <Package className="h-6 w-6 text-primary" />, 
      label: "Live Listings", 
      value: m.listingCount, 
      href: "/admin/listings",
      iconClass: "bg-primary/10",
      trend: "Stable",
      trendIcon: <Minus className="h-3 w-3" />,
      trendColor: "text-muted-foreground"
    },
    { 
      icon: <LifeBuoy className="h-6 w-6 text-destructive" />, 
      label: "Critical Alerts", 
      value: m.alertCount,
      iconClass: "bg-destructive/10",
      trend: "Action Req.",
      trendColor: "text-destructive"
    },
    { 
      icon: <Bell className="h-6 w-6 text-blue-500" />, 
      label: "Unread Matches", 
      value: m.unreadNotifications,
      iconClass: "bg-blue-500/10",
      trend: "NEW",
      trendColor: "text-blue-500"
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Overview</h1>
        <p className="text-lg text-muted-foreground">Real-time marketplace performance and system health.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((s, idx) => {
          const content = (
            <div className={`p-6 rounded-xl border flex flex-col gap-4 h-full transition-shadow hover:shadow-md ${idx === 3 ? 'bg-destructive/5 border-destructive/20' : idx === 4 ? 'bg-blue-500/5 border-blue-500/20' : 'bg-card border-border'}`}>
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${s.iconClass}`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-bold flex items-center gap-1 ${s.trendColor}`}>
                  {s.trend} {s.trendIcon}
                </span>
              </div>
              <div className="mt-auto">
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${idx === 3 ? 'text-destructive/80' : idx === 4 ? 'text-blue-500/80' : 'text-muted-foreground'}`}>
                  {s.label}
                </p>
                <h3 className={`text-3xl font-bold ${idx === 3 ? 'text-destructive' : idx === 4 ? 'text-blue-500' : 'text-foreground'}`}>
                  {s.value}
                </h3>
              </div>
            </div>
          );

          if (s.href) {
            return (
              <Link key={s.label} href={s.href} className="block group">
                {content}
              </Link>
            );
          }

          return (
            <div key={s.label}>
              {content}
            </div>
          );
        })}
      </div>
      
      {/* Chart Placeholder (simplified for MVP) */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h4 className="text-2xl font-bold text-foreground mb-1">Marketplace Activity</h4>
            <p className="text-sm text-muted-foreground">Daily listings vs sales conversion for the last 30 days.</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-lg border border-border text-xs font-bold text-muted-foreground">WEEKLY</div>
            <div className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">MONTHLY</div>
          </div>
        </div>
        <div className="h-64 w-full flex items-end gap-2 px-2 overflow-hidden opacity-50 grayscale pt-8">
          {/* Mock Bars */}
          {[40, 60, 45, 85, 70, 55, 65, 40, 50, 92, 45, 60].map((h, i) => (
            <div key={i} className={`flex-1 rounded-t-sm transition-colors ${h > 80 ? 'bg-primary' : 'bg-muted'} h-[${h}%] hover:bg-primary/40`} style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}