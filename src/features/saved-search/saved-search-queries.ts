import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { savedSearch, inAppNotification, listing, model, make, partType, user, listingYear } from "@/db/schema";
import { eq, and, gt, isNull, desc } from "drizzle-orm";
import { or, like } from "drizzle-orm";
import type { SearchFilters, SavedSearch as SavedSearchDTO } from "@/types";

export const getVendorSavedSearches = cache(async (vendorId: string): Promise<SavedSearchDTO[]> => {
  const rows = await db
    .select()
    .from(savedSearch)
    .where(eq(savedSearch.vendorId, vendorId))
    .orderBy(desc(savedSearch.createdAt));
  return rows.map((r) => ({ ...r, filters: JSON.parse(r.filters) as SearchFilters })) as SavedSearchDTO[];
});

export const getAllSavedSearches = cache(async () => {
  return db.select().from(savedSearch);
});

export const getVendorNotifications = cache(
  async (vendorId: string, limit = 50) => {
    const rows = await db
      .select({
        id: inAppNotification.id,
        readAt: inAppNotification.readAt,
        createdAt: inAppNotification.createdAt,
        listingId: inAppNotification.listingId,
        title: listing.title,
        partNumber: listing.partNumber,
        priceCents: listing.priceCents,
        imageUrl: listing.imageUrl,
        vendorName: user.name,
        businessName: user.businessName,
      })
      .from(inAppNotification)
      .innerJoin(listing, eq(inAppNotification.listingId, listing.id))
      .leftJoin(user, eq(listing.vendorId, user.id))
      .where(eq(inAppNotification.vendorId, vendorId))
      .orderBy(desc(inAppNotification.createdAt))
      .limit(limit);
    return rows;
  },
);

export const getUnreadNotificationCount = cache(async (vendorId: string): Promise<number> => {
  const rows = await db
    .select({ id: inAppNotification.id })
    .from(inAppNotification)
    .where(and(eq(inAppNotification.vendorId, vendorId), isNull(inAppNotification.readAt)))
    .limit(1000);
  return rows.length;
});

// Returns listing ids that match a saved search and were created after `sinceCutoffMs`
// (created_at as unix ms). Used by the cron dispatcher.
export async function findNewMatchingListingsIds(
  filters: SearchFilters,
  sinceCutoffMs: number,
): Promise<{ id: string; createdAt: number }[]> {
  const conditions = [eq(user.status, "active"), gt(listing.createdAt, sinceCutoffMs)];
  if (filters.make) conditions.push(eq(make.slug, filters.make));
  if (filters.model) conditions.push(eq(model.slug, filters.model));
  if (filters.year) {
    const y = Number(filters.year);
    if (!Number.isNaN(y)) conditions.push(eq(listingYear.year, y));
  }
  if (filters.partTypeId) conditions.push(eq(partType.id, filters.partTypeId));
  if (filters.partNumber) conditions.push(like(listing.partNumber, `%${filters.partNumber}%`));
  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(or(like(listing.title, term), like(listing.description, term), like(listing.partNumber, term)) as never);
  }
  const rows = await db
    .select({ id: listing.id, createdAt: listing.createdAt })
    .from(listing)
    .innerJoin(user, eq(listing.vendorId, user.id))
    .leftJoin(make, eq(listing.makeId, make.id))
    .leftJoin(model, eq(listing.modelId, model.id))
    .leftJoin(listingYear, eq(listing.id, listingYear.listingId))
    .innerJoin(partType, eq(listing.partTypeId, partType.id))
    .where(and(...conditions))
    .groupBy(listing.id)
    .orderBy(desc(listing.createdAt))
    .limit(100);
  return rows;
}