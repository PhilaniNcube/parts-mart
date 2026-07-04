"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { make, model, partType, user, listing } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { slugify } from "@/types";
import { getCurrentSession } from "@/features/auth/auth-queries";
import { auth } from "@/lib/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "admin") return null;
  return session;
}

function isUniqueViolation(err: unknown): boolean {
  return err instanceof Error && /UNIQUE constraint/i.test(err.message);
}

const CreateVendorSchema = z.object({
  name: z.string().min(1, "Contact name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  businessName: z.string().optional(),
});

export async function createVendorAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };

  const parsed = CreateVendorSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    businessName: formData.get("businessName") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, parsed.data.email)).limit(1);
  if (existing.length) return { ok: false, error: "An account with that email already exists." };

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: "vendor",
        businessName: parsed.data.businessName ?? null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create vendor account.";
    return { ok: false, error: message };
  }

  revalidatePath("/admin/vendors");
  return { ok: true };
}

export async function addMakeAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Make name is required." };
  try {
    await db.insert(make).values({ id: randomUUID(), name, slug: slugify(name), country: "South Africa" });
  } catch (err) {
    return { ok: false, error: isUniqueViolation(err) ? `"${name}" already exists.` : "Failed to add make." };
  }
  revalidatePath("/admin/catalog/makes");
  return { ok: true };
}

export async function addModelAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };
  const makeId = String(formData.get("makeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const bodyStyle = String(formData.get("bodyStyle") ?? "").trim() || null;
  if (!makeId || !name) return { ok: false, error: "Make and model name are required." };
  try {
    await db.insert(model).values({ id: randomUUID(), makeId, name, slug: slugify(name), bodyStyle });
  } catch (err) {
    return { ok: false, error: isUniqueViolation(err) ? `"${name}" already exists for that make."` : "Failed to add model." };
  }
  revalidatePath("/admin/catalog/makes");
  return { ok: true };
}

export async function addPartTypeAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Part type name is required." };
  try {
    await db.insert(partType).values({ id: randomUUID(), name, slug: slugify(name) });
  } catch (err) {
    return { ok: false, error: isUniqueViolation(err) ? `"${name}" already exists."` : "Failed to add part type." };
  }
  revalidatePath("/admin/catalog/part-types");
  return { ok: true };
}

export async function deleteMakeAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing make." };
  try {
    await db.delete(make).where(eq(make.id, id));
  } catch (err) {
    return { ok: false, error: isUniqueViolation(err) ? "Cannot delete: make is in use." : "Failed to delete make." };
  }
  revalidatePath("/admin/catalog/makes");
  return { ok: true };
}

export async function deletePartTypeAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing part type." };
  const inUse = await db.select({ c: listing.id }).from(listing).where(eq(listing.partTypeId, id)).limit(1);
  if (inUse.length) return { ok: false, error: "Cannot delete: listings use this part type." };
  try {
    await db.delete(partType).where(eq(partType.id, id));
  } catch {
    return { ok: false, error: "Failed to delete part type." };
  }
  revalidatePath("/admin/catalog/part-types");
  return { ok: true };
}

export async function toggleVendorStatusAction(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };
  const vendorId = String(formData.get("vendorId") ?? "");
  const next = String(formData.get("next") ?? "active") === "suspended" ? "suspended" : "active";
  if (!vendorId) return { ok: false, error: "Missing vendor." };
  await db.update(user).set({ status: next, updatedAt: Date.now() }).where(eq(user.id, vendorId));
  revalidatePath("/admin/vendors");
  revalidatePath("/vendor", "layout");
  return { ok: true };
}