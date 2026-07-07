import { ArtifactDetail } from "@/features/artifacts/artifact-detail";
import { DeniedState } from "@/components/StateViews";
import { artifactClient, getProjectOverview } from "@/lib/data";
import { mapArtifactDetail } from "@/lib/contracts/ado-job";
import { AdoApiError } from "@/lib/api/errors";

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

  let detail;
  try {
    detail = mapArtifactDetail(projectKey, artifactKey, await artifactClient.getArtifact(projectKey, artifactKey));
  } catch (error) {
    if (error instanceof AdoApiError && (error.code === "ARTIFACT_NOT_FOUND" || error.code === "PROJECT_NOT_FOUND")) {
      return (
        <DeniedState
          title="이 근거를 볼 수 있는 권한이 없거나 존재하지 않습니다."
          backHref={`/projects/${projectKey}`}
          linkLabel="Project로 돌아가기"
        />
      );
    }
    throw error;
  }

  return <ArtifactDetail detail={detail} backHref={`/projects/${projectKey}`} />;
}
