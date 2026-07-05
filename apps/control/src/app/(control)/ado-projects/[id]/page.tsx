import {
  AdoProjectDetailRoute,
  AdoProjectNotFound,
  AdoProjectLoadError,
} from "@/features/ado-projects/ado-project-detail-route";
import { projectClient, roadmapClient } from "@/lib/data";
import { AdoApiError } from "@/lib/api/errors";
import type { AdoProject } from "@/lib/contracts/ado-project";
import type { AdoRoadmap } from "@/lib/contracts/ado-roadmap";

export default async function AdoProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return <AdoProjectNotFound projectId={id} />;
  }

  let project: AdoProject | null = null;
  let roadmaps: AdoRoadmap[] | null = null;
  let loadError: { code: string; message: string } | null = null;
  let roadmapLoadError: { code: string; message: string } | null = null;

  try {
    project = await projectClient.getProject(numericId);
  } catch (err) {
    loadError = {
      code: err instanceof AdoApiError ? err.code : "UNKNOWN",
      message: err instanceof AdoApiError ? err.message : "프로젝트를 불러오지 못했습니다.",
    };
  }

  if (loadError) {
    if (loadError.code === "PROJECT_NOT_FOUND") {
      return <AdoProjectNotFound projectId={id} />;
    }
    return <AdoProjectLoadError code={loadError.code} message={loadError.message} />;
  }

  try {
    roadmaps = await roadmapClient.listRoadmaps(project!.id);
  } catch (err) {
    roadmapLoadError = {
      code: err instanceof AdoApiError ? err.code : "UNKNOWN",
      message: err instanceof AdoApiError ? err.message : "로드맵을 불러오지 못했습니다.",
    };
  }

  return (
    <AdoProjectDetailRoute
      project={project!}
      initialRoadmaps={roadmaps}
      initialRoadmapError={roadmapLoadError}
    />
  );
}
