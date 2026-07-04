export type Role = "customer" | "vendor" | "admin";
export type UserStatus = "active" | "suspended";
export type ListingCondition = "new" | "remanufactured" | "used" | "refurbished";

export interface Make {
  id: string;
  name: string;
  slug: string;
  country: string | null;
}

export interface VehicleModel {
  id: string;
  makeId: string;
  name: string;
  slug: string;
  bodyStyle: string | null;
}

export interface PartType {
  id: string;
  name: string;
  slug: string;
}

export interface Listing {
  id: string;
  vendorId: string;
  partTypeId: string;
  makeId: string | null;
  modelId: string | null;
  years: number[];
  title: string;
  description: string | null;
  partNumber: string;
  sku: string;
  condition: ListingCondition;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SearchFilters {
  make?: string;
  model?: string;
  year?: string;
  partTypeId?: string;
  partNumber?: string;
  q?: string;
}

export interface SavedSearch {
  id: string;
  vendorId: string;
  name: string;
  filters: SearchFilters;
  lastDispatchedAt: number | null;
  createdAt: number;
}

// ── helpers ───────────────────────────────────────────────────────────────

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function formatYearRange(startYear: number): string {
  return `${startYear}–${new Date().getFullYear()}`;
}

export function formatYears(years: number[]): string {
  if (!years || years.length === 0) return "";
  const sorted = [...years].sort((a, b) => a - b);
  const isContiguous = sorted.every((y, idx) => idx === 0 || y === sorted[idx - 1] + 1);
  if (isContiguous && sorted.length > 1) {
    return `${sorted[0]}–${sorted[sorted.length - 1]}`;
  }
  return sorted.join(", ");
}

export const YEAR_RANGE_SPAN = 60;

export function getYearOptions(span = YEAR_RANGE_SPAN): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: span }, (_, i) => current - span + 1 + i);
}