import { RoadmapListRoute } from "@/features/roadmaps/roadmap-list-route";
import { DeniedState } from "@/components/StateViews";
import { listRoadmaps, isValidRoadmapState, getProjectOverview } from "@/lib/data";

import type { RoadmapSort, RoadmapState } from "@/lib/contracts/roadmaps";

const VALID_SORT: RoadmapSort[] = ["activity", "sequence", "name"];

export default async function RoadmapListPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectKey: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { projectKey } = await params;
  const resolvedSearch = await searchParams;

  const project = getProjectOverview(projectKey);
  if (!project) {
    return <DeniedState title="이 Project를 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" />;
  }

  const stateRaw = typeof resolvedSearch.state === "string" ? resolvedSearch.state : undefined;
  const state: RoadmapState | undefined = stateRaw && isValidRoadmapState(stateRaw) ? stateRaw : undefined;
  const sortRaw = typeof resolvedSearch.sort === "string" ? resolvedSearch.sort : undefined;
  const sort: RoadmapSort = sortRaw && (VALID_SORT as string[]).includes(sortRaw) ? (sortRaw as RoadmapSort) : "activity";

  const response = listRoadmaps(projectKey, { state, sort });

  return (
    <RoadmapListRoute
      projectKey={projectKey}
      projectName={project.project.name}
      response={response}
      state={state}
      sort={sort}
    />
  );
}
