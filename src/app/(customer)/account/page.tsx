import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, LayoutDashboard, Package, Plus, LifeBuoy, Users, ShieldAlert } from "lucide-react";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "My account · PartsMart" };

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPageContent />
    </Suspense>
  );
}

async function AccountPageContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant="outline" className="capitalize">{user.role}</Badge>
      </div>

      {user.status === "suspended" && (
        <Card className="mt-6 border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <CardTitle>Account suspended</CardTitle>
            </div>
            <CardDescription>
              Your account has been suspended by an administrator. Listing management and alerts are disabled.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {user.role === "vendor" && user.status === "active" && (
          <>
            <DashboardLink href="/vendor" icon={<LayoutDashboard className="h-5 w-5" />} title="Vendor dashboard" body="Overview of your listings and alerts." />
            <DashboardLink href="/vendor/listings" icon={<Package className="h-5 w-5" />} title="My listings" body="View, edit and add parts you sell." />
            <DashboardLink href="/vendor/listings/new" icon={<Plus className="h-5 w-5" />} title="Add listing" body="List a new part for sale." />
            <DashboardLink href="/vendor/alerts" icon={<LifeBuoy className="h-5 w-5" />} title="Alert subscriptions" body="Get notified when matching parts appear." />
          </>
        )}

        {user.role === "admin" && (
          <>
            <DashboardLink href="/admin" icon={<LayoutDashboard className="h-5 w-5" />} title="Admin overview" body="Counts of vendors, customers and listings." />
            <DashboardLink href="/admin/catalog/makes" icon={<Building2 className="h-5 w-5" />} title="Catalog" body="Manage makes, models, years and part types." />
            <DashboardLink href="/admin/vendors" icon={<Users className="h-5 w-5" />} title="Vendors" body="View and suspend vendor accounts." />
            <DashboardLink href="/admin/listings" icon={<Package className="h-5 w-5" />} title="All listings" body="Oversee every listing on the marketplace." />
          </>
        )}

        {user.role === "customer" && (
          <Card>
            <CardHeader>
              <CardTitle>Start searching</CardTitle>
              <CardDescription>You don&apos;t need an account to search — find parts across vendors now.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/search">Search parts</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function AccountPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded mt-2" />
        </div>
        <div className="h-6 w-16 bg-muted rounded" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>
    </div>
  );
}

function DashboardLink({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">{icon}</div>
          <CardTitle className="mt-2 text-lg">{title}</CardTitle>
          <CardDescription>{body}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}