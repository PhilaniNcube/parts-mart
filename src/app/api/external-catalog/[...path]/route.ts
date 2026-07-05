import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/features/auth/auth-queries";
import { fetchFromExternalCatalog } from "@/features/external-catalog/external-catalog-queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 1. Authorize: only active admins or vendors are allowed to query external catalog proxy
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "vendor") || user.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // 2. Resolve parameters
  const resolvedParams = await params;
  const pathParts = resolvedParams.path;
  if (!pathParts || pathParts.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing API path" }, { status: 400 });
  }
  const path = pathParts.join("/");

  // 3. Forward query parameters
  const searchParams = request.nextUrl.searchParams;

  // 4. Query RapidAPI Auto Parts Catalog
  try {
    const data = await fetchFromExternalCatalog(path, searchParams);
    return NextResponse.json(data);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch from external catalog";
    return NextResponse.json(
      { ok: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 1. Authorize: only active admins or vendors are allowed to query external catalog proxy
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "vendor") || user.status !== "active") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // 2. Resolve parameters
  const resolvedParams = await params;
  const pathParts = resolvedParams.path;
  if (!pathParts || pathParts.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing API path" }, { status: 400 });
  }
  const path = pathParts.join("/");

  // 3. Forward query parameters
  const searchParams = request.nextUrl.searchParams;

  // 4. Parse request body
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // Body is optional or empty
  }

  // 5. Query RapidAPI Auto Parts Catalog
  try {
    const data = await fetchFromExternalCatalog(path, searchParams, {
      method: "POST",
      body,
    });
    return NextResponse.json(data);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch from external catalog";
    return NextResponse.json(
      { ok: false, error: errorMsg },
      { status: 500 }
    );
  }
}
