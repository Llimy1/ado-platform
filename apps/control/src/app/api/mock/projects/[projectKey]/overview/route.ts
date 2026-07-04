import { NextResponse } from "next/server";
import { getProjectOverview } from "@/lib/data";

/**
 * Stands in for GET /v1/projects/{projectKey}/overview
 * (ADO/CONTROL_ROOM_PAGE_SPECS.md P-02.2). Serves in-memory mock data only.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectKey: string }> },
) {
  const { projectKey } = await params;
  const overview = getProjectOverview(projectKey);
  if (!overview) {
    return NextResponse.json(
      { error: { code: "not_found", message: "project not found" } },
      { status: 404 },
    );
  }
  return NextResponse.json(overview, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
