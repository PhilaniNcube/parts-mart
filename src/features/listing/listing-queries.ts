import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { listing, model, make, partType, user, listingYear } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import type { ListingCondition, Listing as ListingDTO } from "@/types";
import type { SearchHit } from "@/features/search/search-queries";

export interface ListingDetail extends SearchHit {
  description: string | null;
  makeId: string | null;
  modelId: string | null;
}

export const getListingById = cache(async (id: string): Promise<ListingDetail | null> => {
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
      partTypeId: listing.partTypeId,
      partTypeName: partType.name,
      makeName: make.name,
      modelName: model.name,
      years: sql<string | null>`group_concat(${listingYear.year})`,
      createdAt: listing.createdAt,
      description: listing.description,
      makeId: listing.makeId,
      modelId: listing.modelId,
    })
    .from(listing)
    .innerJoin(user, eq(listing.vendorId, user.id))
    .innerJoin(partType, eq(listing.partTypeId, partType.id))
    .leftJoin(make, eq(listing.makeId, make.id))
    .leftJoin(model, eq(listing.modelId, model.id))
    .leftJoin(listingYear, eq(listing.id, listingYear.listingId))
    .where(eq(listing.id, id))
    .groupBy(listing.id)
    .limit(1);
  if (!rows[0]) return null;
  return {
    ...rows[0],
    years: rows[0].years ? rows[0].years.split(",").map(Number) : [],
  } as unknown as ListingDetail;
});

export const getRawListingById = cache(
  async (id: string): Promise<(ListingDTO & { years: number[] }) | null> => {
    const rows = await db.select().from(listing).where(eq(listing.id, id)).limit(1);
    if (!rows[0]) return null;
    const yearsRows = await db
      .select({ year: listingYear.year })
      .from(listingYear)
      .where(eq(listingYear.listingId, id));
    return {
      ...rows[0],
      years: yearsRows.map((y) => y.year),
    } as unknown as ListingDTO & { years: number[] };
  },
);

export const getVendorListings = cache(async (vendorId: string): Promise<SearchHit[]> => {
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
    .where(eq(listing.vendorId, vendorId))
    .groupBy(listing.id)
    .orderBy(desc(listing.createdAt));
  return rows.map((r) => ({
    ...r,
    years: r.years ? r.years.split(",").map(Number) : [],
  })) as SearchHit[];
});

export const getAllListings = cache(async (): Promise<SearchHit[]> => {
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
    .groupBy(listing.id)
    .orderBy(desc(listing.createdAt));
  return rows.map((r) => ({
    ...r,
    years: r.years ? r.years.split(",").map(Number) : [],
  })) as SearchHit[];
});

export function conditionLabel(c: ListingCondition): string {
  return { new: "New", remanufactured: "Remanufactured", used: "Used", refurbished: "Refurbished" }[c];
}