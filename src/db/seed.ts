/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnvConfig(path.resolve(__dirname, "../.."));

import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { slugify } from "@/types";

let db: any;
let make: any, model: any, partType: any, user: any, account: any;
let auth: any;

async function init() {
  const dbMod = await import("@/db");
  db = dbMod.db;
  const schemaMod = await import("@/db/schema");
  make = schemaMod.make;
  model = schemaMod.model;
  partType = schemaMod.partType;
  user = schemaMod.user;
  account = schemaMod.account;
  const authMod = await import("@/lib/auth");
  auth = authMod.auth;
}

// ── getOrCreate helpers (dedup, NOCASE-safe) ────────────────────────────────

async function getOrCreateMake(name: string, country = "South Africa") {
  const existing = await db
    .select({ id: make.id })
    .from(make)
    .where(eq(make.slug, slugify(name)))
    .limit(1);
  if (existing.length) return existing[0].id;
  const id = randomUUID();
  await db.insert(make).values({ id, name, slug: slugify(name), country });
  return id;
}

async function getOrCreateModel(makeId: string, modelName: string, bodyStyle: string | null = null) {
  const existing = await db
    .select({ id: model.id, slug: model.slug })
    .from(model)
    .where(and(eq(model.makeId, makeId), eq(model.slug, slugify(modelName))))
    .limit(1);
  if (existing.length) return existing[0].id;
  const id = randomUUID();
  await db.insert(model).values({ id, makeId, name: modelName, slug: slugify(modelName), bodyStyle });
  return id;
}

async function getOrCreatePartType(name: string) {
  const existing = await db
    .select({ id: partType.id })
    .from(partType)
    .where(eq(partType.slug, slugify(name)))
    .limit(1);
  if (existing.length) return existing[0].id;
  const id = randomUUID();
  await db.insert(partType).values({ id, name, slug: slugify(name) });
  return id;
}

// ── fixture ─────────────────────────────────────────────────────────────────

const SA_CATALOG: Array<[string, Array<string | [string, string]>]> = [
  ["Toyota", ["Hilux", "Corolla", "Quantum", "Fortuner", "Yaris"]],
  ["Volkswagen", ["Polo", "Polo Vivo", "Golf", "Amarok", "Tiguan"]],
  ["Ford", ["Ranger", "EcoSport", "Fiesta", "Everest"]],
  ["Hyundai", ["i20", "Creta", "Grand i10", "Santa Fe"]],
  ["Kia", ["Picanto", "Sportage", "Sorento", "Picanton"]],
  ["Nissan", ["Navara", "Almera", "Qashqai", "X-Trail"]],
  ["Mazda", ["CX-3", "CX-5", "Demio", "BT-50"]],
  ["Mercedes-Benz", ["C-Class", "A-Class", "GLC", "Sprinter"]],
  ["BMW", ["3 Series", "1 Series", "X3", "X5"]],
  ["Audi", ["A3", "A4", "Q5", "Q7"]],
  ["Isuzu", ["D-Max", "MU-X"]],
  ["Renault", ["Kwid", "Captur", "Clio", "Duster"]],
  ["Suzuki", ["Swift", "Vitara", "Baleno", "Jimny"]],
  ["Honda", ["Civic", "Ballade", "CR-V"]],
  ["Land Rover", ["Defender", "Discovery", "Range Rover Evoque"]],
  ["Jeep", ["Grand Cherokee", "Wrangler", "Compass"]],
  ["Haval", ["H6", "Jolion", "Dargo"]],
];

const SEED_PART_TYPES = [
  "Brake Pads",
  "Brake Discs",
  "Oil Filter",
  "Air Filter",
  "Fuel Filter",
  "Spark Plugs",
  "Battery",
  "Alternator",
  "Starter Motor",
  "Timing Belt",
  "Clutch Kit",
  "Shock Absorber",
  "Radiator",
  "Headlight",
  "Exhaust",
  "Control Arm",
];

// ── run ─────────────────────────────────────────────────────────────────────

async function seed() {
  await init();
  console.log("→ seeding catalog (makes + models)…");
  for (const [makeName, modelNames] of SA_CATALOG) {
    const makeId = await getOrCreateMake(makeName);
    for (const entry of modelNames) {
      const mlName = Array.isArray(entry) ? entry[0] : entry;
      const mlStyle = Array.isArray(entry) ? entry[1] : null;
      await getOrCreateModel(makeId, mlName, mlStyle);
    }
  }

  console.log("→ seeding part types…");
  for (const name of SEED_PART_TYPES) await getOrCreatePartType(name);

  console.log("→ seeding admin user…");
  await seedAdmin();

  console.log("✓ seed complete");
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@partsmart.test";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
  if (existing.length) {
    console.log("  admin already exists, skipping");
    return;
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name: "PartsMart Admin", role: "admin" },
    });
    await db.update(user).set({ role: "admin", status: "active" }).where(eq(user.email, email));
    console.log(`  admin created: ${email} (password: ${password})`);
  } catch (err) {
    console.error("  admin creation via better-auth failed, bootstrapping raw row", err);
    const id = randomUUID();
    await db.insert(user).values({ id, email, name: "PartsMart Admin", role: "admin", emailVerified: true });
  }
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

void account;