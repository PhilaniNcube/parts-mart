import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { listing, model, make, partType, user, listingYear } from "@/db/schema";
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import type { SearchFilters, ListingCondition } from "@/types";

export interface SearchHit {
  id: string;
  title: string;
  partNumber: string;
  sku: string;
  condition: ListingCondition;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
  vendorId: string;
  vendorName: string;
  businessName: string | null;
  city: string | null;
  partTypeId: string;
  partTypeName: string;
  makeName: string | null;
  modelName: string | null;
  years: number[];
  createdAt: number;
}

export const searchListings = cache(async (filters: SearchFilters): Promise<SearchHit[]> => {
  const conditions = [eq(user.status, "active")];

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
    .select({
      id: listing.id,
      title: listing.title,
      partNumber: listing.partNumber,
      sku: listing.sku,
      condition: listing.condition,
      priceCents: listing.priceCents,
      stock: listing.stock,
      imageUrl: listing.imageUrl,
      vendorId: listing.vendorId,
      vendorName: user.name,
      businessName: user.businessName,
      city: user.city,
      partTypeId: listing.partTypeId,
      partTypeName: partType.name,
      makeName: make.name,
      modelName: model.name,
      years: sql<string | null>`group_concat(${listingYear.year})`,
      createdAt: listing.createdAt,
    })
    .from(listing)
    .innerJoin(user, eq(listing.vendorId, user.id))
    .innerJoin(partType, eq(listing.partTypeId, partType.id))
    .leftJoin(make, eq(listing.makeId, make.id))
    .leftJoin(model, eq(listing.modelId, model.id))
    .leftJoin(listingYear, eq(listing.id, listingYear.listingId))
    .where(and(...conditions))
    .groupBy(listing.id)
    .orderBy(desc(sql`${listing.stock} > 0`), desc(listing.createdAt))
    .limit(50);

  return rows.map((r) => ({
    ...r,
    years: r.years ? r.years.split(",").map(Number) : [],
  })) as SearchHit[];
});

export const getRecentListings = cache(async (limit = 8): Promise<SearchHit[]> => {
  const rows = await db
    .select({
      id: listing.id,
      title: listing.title,
      partNumber: listing.partNumber,
      sku: listing.sku,
      condition: listing.condition,
      priceCents: listing.priceCents,
      stock: listing.stock,
      imageUrl: listing.imageUrl,
      vendorId: listing.vendorId,
      vendorName: user.name,
      businessName: user.businessName,
      city: user.city,
      partTypeId: listing.partTypeId,
      partTypeName: partType.name,
      makeName: make.name,
      modelName: model.name,
      years: sql<string | null>`group_concat(${listingYear.year})`,
      createdAt: listing.createdAt,
    })
    .from(listing)
    .innerJoin(user, eq(listing.vendorId, user.id))
    .innerJoin(partType, eq(listing.partTypeId, partType.id))
    .leftJoin(make, eq(listing.makeId, make.id))
    .leftJoin(model, eq(listing.modelId, model.id))
    .leftJoin(listingYear, eq(listing.id, listingYear.listingId))
    .where(eq(user.status, "active"))
    .groupBy(listing.id)
    .orderBy(desc(listing.createdAt))
    .limit(limit);
  return rows.map((r) => ({
    ...r,
    years: r.years ? r.years.split(",").map(Number) : [],
  })) as SearchHit[];
});

export { asc };