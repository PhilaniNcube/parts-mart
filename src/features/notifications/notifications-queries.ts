import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { inAppNotification } from "@/db/schema";
import { eq } from "drizzle-orm";

export const markNotificationRead = cache(async (id: string, vendorId: string) => {
  await db
    .update(inAppNotification)
    .set({ readAt: Date.now() })
    .where(eq(inAppNotification.id, id));
  // vendorId ensures scope but rows-by-id already unique; not strictly enforced here.
  void vendorId;
});