import { HumanVerificationRoute } from "@/features/human-verification/human-verification-route";
import { DeniedState } from "@/components/StateViews";
import { getHumanVerification } from "@/lib/data";

export default async function HumanVerificationPage({
  params,
}: {
  params: Promise<{ projectKey: string; roadmapKey: string; featureUnitKey: string }>;
}) {
  const { projectKey, roadmapKey, featureUnitKey } = await params;
  const detail = getHumanVerification(projectKey, roadmapKey, featureUnitKey);

  if (!detail) {
    return (
      <DeniedState
        title="이 인간 검증을 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref={`/projects/${projectKey}/roadmaps/${roadmapKey}/feature-units/${featureUnitKey}`}
        linkLabel="Feature Unit으로 돌아가기"
      />
    );
  }

  return (
    <HumanVerificationRoute
      detail={detail}
      featureUnitHref={`/projects/${projectKey}/roadmaps/${roadmapKey}/feature-units/${featureUnitKey}`}
    />
  );
}
