import { NextResponse, type NextRequest } from "next/server";
import { getModelsByMake } from "@/features/vehicle-catalog/vehicle-catalog-queries";

export async function GET(request: NextRequest) {
  const makeId = request.nextUrl.searchParams.get("makeId");
  if (!makeId) return NextResponse.json([], { headers: { "cache-control": "public, max-age=3600" } });
  const models = await getModelsByMake(makeId);
  return NextResponse.json(models, { headers: { "cache-control": "public, max-age=3600" } });
}