import { sqliteTable, text, integer, uniqueIndex, index, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// ───────────────────────────────────────────────────────────────────────────
// Better Auth tables (user, session, account, verification)
// column keys are camelCase to match Better Auth field names; the drizzle client
// uses casing: "snake_case" so the on-disk columns are snake_case.
// ───────────────────────────────────────────────────────────────────────────

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ["customer", "vendor", "admin"] }).notNull().default("customer"),
  status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
  businessName: text("business_name"),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "number" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "number" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "number" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

// ───────────────────────────────────────────────────────────────────────────
// Vehicle catalog — admin-managed. NOCASE unique constraints prevent dupes.
// Years are NOT stored as rows — they're a plain integer on listing.
// ───────────────────────────────────────────────────────────────────────────

export const make = sqliteTable(
  "make",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    country: text("country"),
    createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  },
  (t) => [
    uniqueIndex("make_name_unique").on(sql`${t.name} COLLATE NOCASE`),
    uniqueIndex("make_slug_unique").on(sql`${t.slug} COLLATE NOCASE`),
  ],
);

export const model = sqliteTable(
  "model",
  {
    id: text("id").primaryKey(),
    makeId: text("make_id")
      .notNull()
      .references(() => make.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    bodyStyle: text("body_style"),
    createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  },
  (t) => [
    uniqueIndex("model_make_name_unique").on(sql`${t.makeId} COLLATE NOCASE`, sql`${t.name} COLLATE NOCASE`),
    uniqueIndex("model_make_slug_unique").on(t.makeId, sql`${t.slug} COLLATE NOCASE`),
    index("model_make_id_idx").on(t.makeId),
  ],
);

// ───────────────────────────────────────────────────────────────────────────
// Part types — admin-managed.
// ───────────────────────────────────────────────────────────────────────────

export const partType = sqliteTable(
  "part_type",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  },
  (t) => [
    uniqueIndex("part_type_name_unique").on(sql`${t.name} COLLATE NOCASE`),
    uniqueIndex("part_type_slug_unique").on(sql`${t.slug} COLLATE NOCASE`),
  ],
);

// ───────────────────────────────────────────────────────────────────────────
// Listings — vendor-owned (admin may edit any listing).
// makeId/modelId/year are nullable: NULL means "universal fit".
// ───────────────────────────────────────────────────────────────────────────

export const listing = sqliteTable(
  "listing",
  {
    id: text("id").primaryKey(),
    vendorId: text("vendor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    partTypeId: text("part_type_id").notNull().references(() => partType.id, { onDelete: "restrict" }),
    makeId: text("make_id").references(() => make.id, { onDelete: "set null" }),
    modelId: text("model_id").references(() => model.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    partNumber: text("part_number").notNull(),
    sku: text("sku").notNull(),
    condition: text("condition", { enum: ["new", "remanufactured", "used", "refurbished"] }).notNull().default("new"),
    priceCents: integer("price_cents").notNull(),
    stock: integer("stock").notNull().default(0),
    imageUrl: text("image_url"),
    createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
    updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  },
  (t) => [
    index("listing_vendor_idx").on(t.vendorId),
    index("listing_part_type_idx").on(t.partTypeId),
    index("listing_make_idx").on(t.makeId),
    index("listing_model_idx").on(t.modelId),
    index("listing_part_number_idx").on(sql`${t.partNumber} COLLATE NOCASE`),
    index("listing_title_idx").on(t.title),
  ],
);

// ───────────────────────────────────────────────────────────────────────────
// Vendor saved searches / alert subscriptions.
// ───────────────────────────────────────────────────────────────────────────

export const savedSearch = sqliteTable("saved_search", {
  id: text("id").primaryKey(),
  vendorId: text("vendor_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // JSON filters: { make?, model?, year?, partTypeId?, partNumber?, query? }
  filters: text("filters").notNull(),
  lastDispatchedAt: integer("last_dispatched_at", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

export const inAppNotification = sqliteTable(
  "in_app_notification",
  {
    id: text("id").primaryKey(),
    vendorId: text("vendor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
      .notNull()
      .references(() => listing.id, { onDelete: "cascade" }),
    readAt: integer("read_at", { mode: "number" }),
    createdAt: integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
  },
  (t) => [
    uniqueIndex("notification_unique").on(t.vendorId, t.listingId),
    index("notification_vendor_idx").on(t.vendorId),
    index("notification_listing_idx").on(t.listingId),
  ],
);

// ───────────────────────────────────────────────────────────────────────────
// Relations
// ───────────────────────────────────────────────────────────────────────────

export const makeRelations = relations(make, ({ many }) => ({ models: many(model) }));
export const modelRelations = relations(model, ({ one, many }) => ({
  make: one(make, { fields: [model.makeId], references: [make.id] }),
  listings: many(listing),
}));
export const partTypeRelations = relations(partType, ({ many }) => ({ listings: many(listing) }));
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  listings: many(listing),
  savedSearches: many(savedSearch),
  notifications: many(inAppNotification),
}));
export const sessionRelations = relations(session, ({ one }) => ({ user: one(user, { fields: [session.userId], references: [user.id] }) }));
export const accountRelations = relations(account, ({ one }) => ({ user: one(user, { fields: [account.userId], references: [user.id] }) }));
export const listingRelations = relations(listing, ({ one, many }) => ({
  vendor: one(user, { fields: [listing.vendorId], references: [user.id] }),
  partType: one(partType, { fields: [listing.partTypeId], references: [partType.id] }),
  make: one(make, { fields: [listing.makeId], references: [make.id] }),
  model: one(model, { fields: [listing.modelId], references: [model.id] }),
  years: many(listingYear),
}));
export const savedSearchRelations = relations(savedSearch, ({ one }) => ({ vendor: one(user, { fields: [savedSearch.vendorId], references: [user.id] }) }));
export const inAppNotificationRelations = relations(inAppNotification, ({ one }) => ({
  vendor: one(user, { fields: [inAppNotification.vendorId], references: [user.id] }),
  listing: one(listing, { fields: [inAppNotification.listingId], references: [listing.id] }),
}));

// ───────────────────────────────────────────────────────────────────────────
// Joint table for listings and multiple model years
// ───────────────────────────────────────────────────────────────────────────
export const listingYear = sqliteTable(
  "listing_year",
  {
    listingId: text("listing_id")
      .notNull()
      .references(() => listing.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.listingId, t.year] }),
    index("listing_year_id_idx").on(t.listingId),
    index("listing_year_year_idx").on(t.year),
  ]
);

export const listingYearRelations = relations(listingYear, ({ one }) => ({
  listing: one(listing, { fields: [listingYear.listingId], references: [listing.id] }),
}));