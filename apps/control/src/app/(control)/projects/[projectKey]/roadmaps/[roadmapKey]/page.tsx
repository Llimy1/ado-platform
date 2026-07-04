import { RoadmapDetailRoute } from "@/features/roadmaps/roadmap-detail-route";
import { DeniedState } from "@/components/StateViews";
import { getRoadmapDetail, getProjectOverview } from "@/lib/data";

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ projectKey: string; roadmapKey: string }>;
}) {
  const { projectKey, roadmapKey } = await params;

  const project = getProjectOverview(projectKey);
  const detail = getRoadmapDetail(projectKey, roadmapKey);

  if (!project || !detail) {
    return (
      <DeniedState
        title="이 Roadmap을 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref={`/projects/${projectKey}/roadmaps`}
        linkLabel="Roadmaps로 돌아가기"
      />
    );
  }

  return <RoadmapDetailRoute projectKey={projectKey} projectName={project.project.name} detail={detail} />;
}
