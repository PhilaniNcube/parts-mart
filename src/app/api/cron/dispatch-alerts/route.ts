import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { savedSearch, inAppNotification, user, listing } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { env } from "@/lib/env";
import { sendAlertEmail } from "@/lib/resend";
import { findNewMatchingListingsIds } from "@/features/saved-search/saved-search-queries";
import type { SearchFilters } from "@/types";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let dispatched = 0;
  let emailsSent = 0;

  const subscriptions = await db.select().from(savedSearch);

  for (const sub of subscriptions) {
    const filters = JSON.parse(sub.filters) as SearchFilters;
    const cutoff = sub.lastDispatchedAt ?? sub.createdAt;
    const matches = await findNewMatchingListingsIds(filters, cutoff);
    if (matches.length === 0) continue;

    // Fetch vendor
    const vendorRows = await db.select().from(user).where(eq(user.id, sub.vendorId)).limit(1);
    const vendor = vendorRows[0];
    if (!vendor) continue;

    // Fetch listing titles for email
    const ids = matches.map((m) => m.id);
    const listingRows = await db.select({ id: listing.id, title: listing.title }).from(listing).where(inArray(listing.id, ids));

    // Insert in-app notifications (deduped by unique(vendorId, listingId); ignore failures)
    for (const id of ids) {
      try {
        await db.insert(inAppNotification).values({ id: randomUUID(), vendorId: sub.vendorId, listingId: id });
      } catch {
        // duplicate already exists — ignore
      }
    }

    // Send email alert
    const matchesUrl = new URL("/vendor/notifications", env.BETTER_AUTH_URL).toString();
    const res = await sendAlertEmail({
      to: vendor.email,
      vendorName: vendor.businessName ?? vendor.name,
      searchName: sub.name,
      matchCount: matches.length,
      matchesUrl,
    });
    if (res && "ok" in res && res.ok) emailsSent++;

    // Advance the watermark to the newest matched listing's createdAt
    const maxCreatedAt = matches.reduce((m, x) => (x.createdAt > m ? x.createdAt : m), cutoff);
    await db.update(savedSearch).set({ lastDispatchedAt: maxCreatedAt }).where(eq(savedSearch.id, sub.id));
    dispatched++;
    void listingRows;
  }

  return NextResponse.json({ ok: true, dispatched, emailsSent });
}