import { Suspense } from "react";
import Link from "next/link";
import { getCurrentSession } from "@/features/auth/auth-queries";
import { UserMenu, type HeaderUser } from "@/components/user-menu";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-sm">PM</span>
          <span className="hidden sm:inline">PartsMart</span>
        </Link>

        <nav className="ml-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Button asChild variant="ghost" size="sm">
            <Link href="/search">Search parts</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<div className="h-8 w-16 bg-muted rounded animate-pulse" />}>
            <HeaderUserSection />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

async function HeaderUserSection() {
  const session = await getCurrentSession();
  const user = session?.user;

  if (user) {
    return <UserMenu user={user as HeaderUser} />;
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Get started</Link>
      </Button>
    </>
  );
}