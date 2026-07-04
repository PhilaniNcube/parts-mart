"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { savedSearch, inAppNotification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/features/auth/auth-queries";
import type { SearchFilters } from "@/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createSavedSearchAction(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "vendor" || session.user.status !== "active") {
    return { ok: false, error: "Only active vendors can save searches." };
  }
  const name = String(formData.get("name") ?? "").trim() || "My search";
  const filtersRaw = String(formData.get("filters") ?? "{}");
  let filters: SearchFilters;
  try {
    filters = JSON.parse(filtersRaw) as SearchFilters;
  } catch {
    return { ok: false, error: "Invalid search filters." };
  }

  await db.insert(savedSearch).values({
    id: randomUUID(),
    vendorId: session.user.id,
    name,
    filters: JSON.stringify(filters),
    lastDispatchedAt: Date.now(), // baseline now; only future listings will alert
  });
  revalidatePath("/vendor/alerts");
  return { ok: true };
}

export async function deleteSavedSearchAction(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "vendor") return { ok: false, error: "Not authorized." };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing search id." };
  await db.delete(savedSearch).where(eq(savedSearch.id, id));
  revalidatePath("/vendor/alerts");
  return { ok: true };
}

export async function markNotificationReadAction(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "vendor") return { ok: false, error: "Not authorized." };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing notification id." };
  await db.update(inAppNotification).set({ readAt: Date.now() }).where(eq(inAppNotification.id, id));
  revalidatePath("/vendor/notifications");
  return { ok: true };
}