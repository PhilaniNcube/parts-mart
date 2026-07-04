import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { SiteHeader } from "@/components/site-header";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<CustomerLayoutSkeleton />}>
        <CustomerLayoutInner>{children}</CustomerLayoutInner>
      </Suspense>
    </>
  );
}

async function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="flex-1 flex flex-col container mx-auto max-w-5xl px-4 py-10">
      {children}
    </main>
  );
}

function CustomerLayoutSkeleton() {
  return (
    <main className="flex-1 flex flex-col container mx-auto max-w-5xl px-4 py-10 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded mb-6" />
      <div className="h-64 bg-muted rounded-xl" />
    </main>
  );
}