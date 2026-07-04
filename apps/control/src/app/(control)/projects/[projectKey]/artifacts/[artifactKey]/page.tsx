import { ArtifactDetail } from "@/features/artifacts/artifact-detail";
import { DeniedState } from "@/components/StateViews";
import { getArtifactDetail, getProjectOverview } from "@/lib/data";

export default async function ArtifactDetailPage({
  params,
}: {
  params: Promise<{ projectKey: string; artifactKey: string }>;
}) {
  const { projectKey, artifactKey } = await params;

  const project = getProjectOverview(projectKey);
  if (!project) {
    return <DeniedState title="이 Project를 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" />;
  }

  const detail = getArtifactDetail(projectKey, artifactKey);
  if (!detail) {
    return (
      <DeniedState
        title="이 근거를 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref={`/projects/${projectKey}`}
        linkLabel="Project로 돌아가기"
      />
    );
  }

  return <ArtifactDetail detail={detail} backHref={`/projects/${projectKey}`} />;
}
