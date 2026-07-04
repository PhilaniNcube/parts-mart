import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { make, model, partType } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { slugify, type Make, type VehicleModel, type PartType } from "@/types";

export const getMakes = cache(async (): Promise<Make[]> => {
  const rows = await db
    .select({ id: make.id, name: make.name, slug: make.slug, country: make.country })
    .from(make)
    .orderBy(asc(make.name));
  return rows as Make[];
});

export const getModelsByMake = cache(async (makeId: string): Promise<VehicleModel[]> => {
  const rows = await db
    .select({ id: model.id, makeId: model.makeId, name: model.name, slug: model.slug, bodyStyle: model.bodyStyle })
    .from(model)
    .where(eq(model.makeId, makeId))
    .orderBy(asc(model.name));
  return rows as VehicleModel[];
});

export const getPartTypes = cache(async (): Promise<PartType[]> => {
  const rows = await db
    .select({ id: partType.id, name: partType.name, slug: partType.slug })
    .from(partType)
    .orderBy(asc(partType.name));
  return rows as PartType[];
});

export const getMakeBySlug = cache(async (slug: string): Promise<Make | null> => {
  const rows = await db
    .select({ id: make.id, name: make.name, slug: make.slug, country: make.country })
    .from(make)
    .where(eq(make.slug, slug))
    .limit(1);
  return (rows[0] as Make) ?? null;
});

export const getModelBySlug = cache(async (makeId: string, slug: string): Promise<VehicleModel | null> => {
  const rows = await db
    .select({ id: model.id, makeId: model.makeId, name: model.name, slug: model.slug, bodyStyle: model.bodyStyle })
    .from(model)
    .where(eq(model.makeId, makeId))
    .limit(100);
  const found = rows.find((r) => r.slug === slug);
  return (found as VehicleModel) ?? null;
});

export const getMakeById = cache(async (id: string): Promise<Make | null> => {
  const rows = await db
    .select({ id: make.id, name: make.name, slug: make.slug, country: make.country })
    .from(make)
    .where(eq(make.id, id))
    .limit(1);
  return (rows[0] as Make) ?? null;
});

export const getModelById = cache(async (id: string): Promise<VehicleModel | null> => {
  const rows = await db
    .select({ id: model.id, makeId: model.makeId, name: model.name, slug: model.slug, bodyStyle: model.bodyStyle })
    .from(model)
    .where(eq(model.id, id))
    .limit(1);
  return (rows[0] as VehicleModel) ?? null;
});

export interface CatalogTreeNode {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  models: { id: string; name: string; slug: string; bodyStyle: string | null }[];
}

export const getCatalogTree = cache(async (): Promise<CatalogTreeNode[]> => {
  const makesRows = await db
    .select({ id: make.id, name: make.name, slug: make.slug, country: make.country })
    .from(make)
    .orderBy(asc(make.name));
  const modelsRows = await db
    .select({ id: model.id, makeId: model.makeId, name: model.name, slug: model.slug, bodyStyle: model.bodyStyle })
    .from(model)
    .orderBy(asc(model.name));

  const modelsByMake = new Map<string, CatalogTreeNode["models"]>();
  for (const m of modelsRows) {
    const arr = modelsByMake.get(m.makeId) ?? [];
    arr.push({ id: m.id, name: m.name, slug: m.slug, bodyStyle: m.bodyStyle });
    modelsByMake.set(m.makeId, arr);
  }
  return makesRows.map((mk) => ({ ...mk, models: modelsByMake.get(mk.id) ?? [] })) as CatalogTreeNode[];
});

export { slugify };