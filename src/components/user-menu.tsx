"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Building2, LifeBuoy, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/features/auth/auth-actions";
import { toast } from "@/hooks/use-toast";

export interface HeaderUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  businessName: string | null;
}

export function UserMenu({ user }: { user: HeaderUser }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const dashboardHref =
    user.role === "vendor" ? "/vendor" : user.role === "admin" ? "/admin" : "/account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="hidden sm:inline">{user.name}</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardHref}>
            <UserIcon /> Dashboard
          </Link>
        </DropdownMenuItem>
        {user.role === "vendor" && (
          <DropdownMenuItem asChild>
            <Link href="/vendor/alerts">
              <LifeBuoy /> Alert subscriptions
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin/catalog/makes">
              <Building2 /> Catalog
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/account">
            <Settings /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onClick={() =>
          startTransition(async () => {
            const res = await signOutAction().catch(() => null);
            toast.success("Signed out", "You have been signed out.");
            router.push(res?.ok ? res.redirectTo ?? "/" : "/");
          })
        }
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}