import { NextRequest, NextResponse } from "next/server";
import { queryProjects, validateProjectListQuery } from "@/lib/data";

/**
 * Stands in for GET /v1/projects (ADO/CONTROL_ROOM_PAGE_SPECS.md P-01.2).
 * Serves in-memory mock data only; no database is involved.
 */
export async function GET(request: NextRequest) {
  const result = validateProjectListQuery(request.nextUrl.searchParams);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const body = queryProjects(result.query);
  return NextResponse.json(body, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
