"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "@/db";
import { listing, listingYear } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/features/auth/auth-queries";

export type ActionResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string };

const ListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  partNumber: z.string().min(1, "Part number is required"),
  sku: z.string().min(1, "SKU is required"),
  condition: z.enum(["new", "remanufactured", "used", "refurbished"]),
  partTypeId: z.string().min(1, "Part type is required"),
  makeId: z.string().optional().or(z.literal("")),
  modelId: z.string().optional().or(z.literal("")),
  years: z.array(z.coerce.number().int().min(1900).max(2100)).optional(),
  priceRands: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

async function assertCanWriteListings() {
  const session = await getCurrentSession();
  if (!session) return null;
  if (session.user.role !== "vendor" && session.user.role !== "admin") return null;
  if (session.user.status !== "active") return null;
  return session;
}

export async function createListingAction(formData: FormData): Promise<ActionResult> {
  const session = await assertCanWriteListings();
  if (!session) return { ok: false, error: "Not authorized to create listings." };

  const parsed = ListingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    partNumber: formData.get("partNumber"),
    sku: formData.get("sku"),
    condition: formData.get("condition"),
    partTypeId: formData.get("partTypeId"),
    makeId: formData.get("makeId") || "",
    modelId: formData.get("modelId") || "",
    years: formData.getAll("years"),
    priceRands: formData.get("priceRands"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl") || "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const vendorId =
    session.user.role === "admin" ? String(formData.get("vendorId") ?? "") : session.user.id;
  if (!vendorId || vendorId.trim() === "") return { ok: false, error: "Vendor is required." };

  const id = randomUUID();
  try {
    await db.transaction(async (tx) => {
      await tx.insert(listing).values({
        id,
        vendorId,
        partTypeId: parsed.data.partTypeId,
        makeId: parsed.data.makeId || null,
        modelId: parsed.data.modelId || null,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        partNumber: parsed.data.partNumber,
        sku: parsed.data.sku,
        condition: parsed.data.condition,
        priceCents: Math.round(parsed.data.priceRands * 100),
        stock: parsed.data.stock,
        imageUrl: parsed.data.imageUrl || null,
      });

      if (parsed.data.years && parsed.data.years.length > 0) {
        await tx.insert(listingYear).values(
          parsed.data.years.map((y) => ({
            listingId: id,
            year: y,
          }))
        );
      }
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create listing." };
  }
  revalidatePath("/vendor/listings");
  revalidatePath("/admin/listings");
  revalidatePath("/search");
  return { ok: true, redirectTo: "/vendor/listings" };
}

export async function updateListingAction(formData: FormData): Promise<ActionResult> {
  const session = await assertCanWriteListings();
  if (!session) return { ok: false, error: "Not authorized." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Listing id is required." };

  const parsed = ListingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    partNumber: formData.get("partNumber"),
    sku: formData.get("sku"),
    condition: formData.get("condition"),
    partTypeId: formData.get("partTypeId"),
    makeId: formData.get("makeId") || "",
    modelId: formData.get("modelId") || "",
    years: formData.getAll("years"),
    priceRands: formData.get("priceRands"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl") || "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await db.select().from(listing).where(eq(listing.id, id)).limit(1);
  if (!existing[0]) return { ok: false, error: "Listing not found." };
  if (session.user.role === "vendor" && existing[0].vendorId !== session.user.id) {
    return { ok: false, error: "You can only edit your own listings." };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(listing)
        .set({
          title: parsed.data.title,
          description: parsed.data.description ?? null,
          partNumber: parsed.data.partNumber,
          sku: parsed.data.sku,
          condition: parsed.data.condition,
          partTypeId: parsed.data.partTypeId,
          makeId: parsed.data.makeId || null,
          modelId: parsed.data.modelId || null,
          priceCents: Math.round(parsed.data.priceRands * 100),
          stock: parsed.data.stock,
          imageUrl: parsed.data.imageUrl || null,
          updatedAt: Date.now(),
        })
        .where(eq(listing.id, id));

      await tx.delete(listingYear).where(eq(listingYear.listingId, id));

      if (parsed.data.years && parsed.data.years.length > 0) {
        await tx.insert(listingYear).values(
          parsed.data.years.map((y) => ({
            listingId: id,
            year: y,
          }))
        );
      }
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update listing." };
  }
  revalidatePath("/vendor/listings");
  revalidatePath("/admin/listings");
  revalidatePath(`/listings/${id}`);
  revalidatePath("/search");
  return { ok: true, redirectTo: "/vendor/listings" };
}

export async function deleteListingAction(formData: FormData): Promise<ActionResult> {
  const session = await assertCanWriteListings();
  if (!session) return { ok: false, error: "Not authorized." };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Listing id is required." };

  const existing = await db.select().from(listing).where(eq(listing.id, id)).limit(1);
  if (!existing[0]) return { ok: false, error: "Listing not found." };
  if (session.user.role === "vendor" && existing[0].vendorId !== session.user.id) {
    return { ok: false, error: "You can only delete your own listings." };
  }

  try {
    await db.delete(listing).where(eq(listing.id, id));
  } catch {
    return { ok: false, error: "Failed to delete listing." };
  }
  revalidatePath("/vendor/listings");
  revalidatePath("/admin/listings");
  revalidatePath("/search");
  return { ok: true };
}