import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, LifeBuoy, Bell } from "lucide-react";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container mx-auto max-w-7xl px-4 py-8 flex-1 flex flex-col">
        <div className="grid gap-8 lg:grid-cols-[200px_1fr] flex-1">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="px-2 text-xs font-medium uppercase text-muted-foreground">Vendor</p>
            <nav className="mt-2 flex flex-col gap-1">
              {[
                { href: "/vendor", label: "Dashboard", icon: LayoutDashboard },
                { href: "/vendor/listings", label: "Listings", icon: Package },
                { href: "/vendor/alerts", label: "Alerts", icon: LifeBuoy },
                { href: "/vendor/notifications", label: "Notifications", icon: Bell },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent",
                  )}
                >
                  <l.icon className="h-4 w-4" /> {l.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">
            <Suspense fallback={<VendorLayoutSkeleton />}>
              <VendorLayoutInner>{children}</VendorLayoutInner>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function VendorLayoutInner({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "vendor") redirect("/account");
  if (user.status !== "active") redirect("/account");

  return <>{children}</>;
}

function VendorLayoutSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}