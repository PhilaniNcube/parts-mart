import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { user, listing, savedSearch, inAppNotification } from "@/db/schema";
import { eq, isNull, count, and } from "drizzle-orm";

export interface VendorRow {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  role: string;
  status: string;
  createdAt: number;
  listingCount: number;
}

export const getAllVendors = cache(async (): Promise<VendorRow[]> => {
  const users = await db
    .select({ id: user.id, name: user.name, email: user.email, businessName: user.businessName, role: user.role, status: user.status, createdAt: user.createdAt })
    .from(user)
    .where(eq(user.role, "vendor"))
    .orderBy(user.createdAt);
  const counts = await db
    .select({ vendorId: listing.vendorId, value: count() })
    .from(listing)
    .groupBy(listing.vendorId);
  const map = new Map(counts.map((c) => [c.vendorId, Number(c.value)]));
  return users.map((u) => ({ ...u, listingCount: map.get(u.id) ?? 0 }));
});

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}
export const getAllCustomers = cache(async (): Promise<CustomerRow[]> => {
  const rows = await db
    .select({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt })
    .from(user)
    .where(eq(user.role, "customer"))
    .orderBy(user.createdAt);
  return rows as CustomerRow[];
});

export interface Metrics {
  vendorCount: number;
  customerCount: number;
  listingCount: number;
  alertCount: number;
  unreadNotifications: number;
}
export const getAdminMetrics = cache(async (): Promise<Metrics> => {
  const v = await db.select({ c: count() }).from(user).where(eq(user.role, "vendor"));
  const c = await db.select({ c: count() }).from(user).where(eq(user.role, "customer"));
  const l = await db.select({ c: count() }).from(listing);
  const s = await db.select({ c: count() }).from(savedSearch);
  const n = await db.select({ c: count() }).from(inAppNotification).where(isNull(inAppNotification.readAt));
  return {
    vendorCount: Number(v[0]?.c ?? 0),
    customerCount: Number(c[0]?.c ?? 0),
    listingCount: Number(l[0]?.c ?? 0),
    alertCount: Number(s[0]?.c ?? 0),
    unreadNotifications: Number(n[0]?.c ?? 0),
  };
});

export const getVendorsForDropdown = cache(async () => {
  const rows = await db
    .select({ id: user.id, name: user.name, businessName: user.businessName })
    .from(user)
    .where(and(eq(user.role, "vendor"), eq(user.status, "active")))
    .orderBy(user.name);
  return rows.map((r) => ({ id: r.id, name: r.name, businessName: r.businessName }));
});

export { count };