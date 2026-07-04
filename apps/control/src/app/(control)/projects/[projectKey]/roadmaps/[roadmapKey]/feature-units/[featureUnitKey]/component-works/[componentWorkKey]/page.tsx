import { ComponentWorkDetailRoute } from "@/features/component-work/component-work-detail-route";
import { DeniedState } from "@/components/StateViews";
import { getComponentWorkDetail, getFeatureUnitDetail, getRoadmapDetail, getProjectOverview } from "@/lib/data";

export default async function ComponentWorkDetailPage({
  params,
}: {
  params: Promise<{ projectKey: string; roadmapKey: string; featureUnitKey: string; componentWorkKey: string }>;
}) {
  const { projectKey, roadmapKey, featureUnitKey, componentWorkKey } = await params;

  const project = getProjectOverview(projectKey);
  const roadmap = getRoadmapDetail(projectKey, roadmapKey);
  const featureUnit = getFeatureUnitDetail(projectKey, roadmapKey, featureUnitKey);
  const detail = getComponentWorkDetail(projectKey, roadmapKey, featureUnitKey, componentWorkKey);

  if (!project || !roadmap || !featureUnit || !detail) {
    return (
      <DeniedState
        title="이 Component Work를 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref={`/projects/${projectKey}/roadmaps/${roadmapKey}/feature-units/${featureUnitKey}`}
        linkLabel="Feature Unit으로 돌아가기"
      />
    );
  }

  return (
    <ComponentWorkDetailRoute
      projectKey={projectKey}
      projectName={project.project.name}
      roadmapKey={roadmapKey}
      roadmapTitle={roadmap.roadmap.title}
      featureUnitKey={featureUnitKey}
      featureUnitTitle={featureUnit.featureUnit.title}
      detail={detail}
    />
  );
}
