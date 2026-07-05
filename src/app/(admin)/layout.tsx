import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Package, 
  Search, 
  Settings, 
  LogOut, 
  Bell,
  ChevronDown,
  Terminal
} from "lucide-react";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/catalog/makes", label: "Catalog", icon: Building2 },
  { href: "/admin/vendors", label: "Vendors", icon: Users },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/listings", label: "All Listings", icon: Package },
  { href: "/admin/catalog/rapidapi", label: "API Explorer", icon: Terminal },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border bg-sidebar">
          {/* Brand / Logo */}
          <SidebarHeader className="h-16 flex flex-row items-center px-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg leading-none tracking-tight">PM</span>
              </div>
              <span className="font-bold text-lg tracking-tight">PartsMart</span>
            </Link>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="py-6 px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-2">Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map((l) => (
                    <SidebarMenuItem key={l.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={l.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <l.icon className="h-4 w-4" /> 
                          <span>{l.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* User Profile Footer - Async / Suspended */}
          <Suspense fallback={<AdminSidebarFooterSkeleton />}>
            <AdminSidebarFooter />
          </Suspense>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          
          {/* Top Navbar */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="hidden sm:flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search across platform..." 
                  className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={<AdminLayoutSkeleton />}>
              <AdminAuthGate>
                {children}
              </AdminAuthGate>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

async function AdminSidebarFooter() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <SidebarFooter className="border-t border-border p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {user.name?.substring(0, 2).toUpperCase() || "AD"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}

async function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "admin") redirect("/account");

  return <>{children}</>;
}

function AdminSidebarFooterSkeleton() {
  return (
    <SidebarFooter className="border-t border-border p-4">
      <div className="flex w-full items-center gap-3 p-2">
        <div className="h-9 w-9 rounded-full bg-muted shrink-0 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-3 bg-muted rounded animate-pulse w-32" />
        </div>
      </div>
    </SidebarFooter>
  );
}

function AdminLayoutSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-background animate-pulse w-full">
      {/* Content Area skeleton */}
      <div className="flex-1 p-6 md:p-10" />
    </div>
  );
}