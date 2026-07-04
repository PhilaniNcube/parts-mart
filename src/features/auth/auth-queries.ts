import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth, type Session } from "@/lib/auth";

import { cacheLife, cacheTag } from "next/cache";

export const getCurrentSession = cache(async (): Promise<Session | null> => {
  "use cache: private";
  cacheTag("session");
  cacheLife("seconds");
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  return session ?? null;
});

export const getCurrentUser = cache(async () => {
  "use cache: private";
  cacheTag("session");
  cacheLife("seconds");
  const session = await getCurrentSession();
  return session?.user ?? null;
});

export const requireRole = cache(
  async (role: "customer" | "vendor" | "admin") => {
    "use cache: private";
    cacheTag("session");
    cacheLife("seconds");
    const session = await getCurrentSession();
    if (!session) return null;
    if (session.user.role !== role) return null;
    return session;
  },
);