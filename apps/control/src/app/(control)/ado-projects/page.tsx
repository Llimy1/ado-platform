import { AdoProjectListRoute, type AdoProjectListError } from "@/features/ado-projects/ado-project-list-route";
import { projectClient } from "@/lib/data";
import { AdoApiError } from "@/lib/api/errors";
import type { AdoProject } from "@/lib/contracts/ado-project";

// This list reads live data from apps/api; without this it has no
// searchParams/cookies to trigger dynamic rendering, so Next would otherwise
// prerender it once at build time and freeze the snapshot.
export const dynamic = "force-dynamic";

export default async function AdoProjectsPage() {
  let items: AdoProject[] | null = null;
  let error: AdoProjectListError | null = null;

  try {
    items = await projectClient.listProjects();
  } catch (err) {
    error = {
      code: err instanceof AdoApiError ? err.code : "UNKNOWN",
      message: err instanceof AdoApiError ? err.message : "프로젝트 목록을 불러오지 못했습니다.",
    };
  }

  return <AdoProjectListRoute initialItems={items} initialError={error} />;
}
