import "server-only";
import { cache } from "react";
import { env } from "@/lib/env";

/**
 * Low-level utility to perform a signed fetch to the Auto Parts Catalog API on RapidAPI.
 * Responses are cached by Next.js/React cache for performance and to save API quota.
 */
export const fetchFromExternalCatalog = cache(async (path: string, searchParams?: URLSearchParams) => {
  const apiKey = env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY environment variable is not configured. Please add it to your .env or .env.local file.");
  }

  // Normalize path to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const queryStr = searchParams && searchParams.toString() ? `?${searchParams.toString()}` : "";
  const url = `https://auto-parts-catalog.p.rapidapi.com/${cleanPath}${queryStr}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "auto-parts-catalog.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson && typeof errorJson === "object" && (errorJson.message || errorJson.error)) {
        errorMsg = errorJson.message || errorJson.error;
      }
    } catch {
      const text = await response.text().catch(() => "");
      if (text) errorMsg = text.slice(0, 150);
    }
    throw new Error(`RapidAPI Auto Parts Catalog Error: ${errorMsg}`);
  }

  return response.json();
});

/**
 * Get the list of auto parts manufacturers/makes.
 */
export async function getExternalManufacturers(
  typeId: string = "1",
  langId: string = "4",
  countryFilterId: string = "63"
) {
  return fetchFromExternalCatalog(
    `manufacturers/list/type-id/${typeId}/lang-id/${langId}/country-filter-id/${countryFilterId}`
  );
}

/**
 * Get the list of vehicle models for a manufacturer.
 */
export async function getExternalModels(
  manufacturerId: string,
  typeId: string = "1",
  langId: string = "4",
  countryFilterId: string = "63"
) {
  return fetchFromExternalCatalog(
    `models/list/type-id/${typeId}/manufacturer-id/${manufacturerId}/lang-id/${langId}/country-filter-id/${countryFilterId}`
  );
}

/**
 * Get the list of vehicle variants/engines for a model.
 */
export async function getExternalVehicles(
  manufacturerId: string,
  modelId: string,
  typeId: string = "1",
  langId: string = "4",
  countryFilterId: string = "63"
) {
  return fetchFromExternalCatalog(
    `vehicles/list/type-id/${typeId}/manufacturer-id/${manufacturerId}/model-id/${modelId}/lang-id/${langId}/country-filter-id/${countryFilterId}`
  );
}
