import { FeatureUnitDetailRoute } from "@/features/feature-unit/feature-unit-detail-route";
import { DeniedState } from "@/components/StateViews";
import { getFeatureUnitDetail, getRoadmapDetail, getProjectOverview } from "@/lib/data";

export default async function FeatureUnitDetailPage({
  params,
}: {
  params: Promise<{ projectKey: string; roadmapKey: string; featureUnitKey: string }>;
}) {
  const { projectKey, roadmapKey, featureUnitKey } = await params;

  const project = getProjectOverview(projectKey);
  const roadmap = getRoadmapDetail(projectKey, roadmapKey);
  const detail = getFeatureUnitDetail(projectKey, roadmapKey, featureUnitKey);

  if (!project || !roadmap || !detail) {
    return (
      <DeniedState
        title="이 Feature Unit을 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref={`/projects/${projectKey}/roadmaps/${roadmapKey}`}
        linkLabel="Roadmap으로 돌아가기"
      />
    );
  }

  return (
    <FeatureUnitDetailRoute
      projectKey={projectKey}
      projectName={project.project.name}
      roadmapKey={roadmapKey}
      roadmapTitle={roadmap.roadmap.title}
      detail={detail}
    />
  );
}
