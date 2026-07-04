import { DecisionDetail } from "@/features/decisions/decision-detail";
import { DeniedState } from "@/components/StateViews";
import { getDecisionDetail } from "@/lib/data";

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ projectKey: string; decisionKey: string }>;
}) {
  const { projectKey, decisionKey } = await params;
  const detail = getDecisionDetail(projectKey, decisionKey);

  if (!detail) {
    return (
      <DeniedState
        title="이 결정을 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref={`/projects/${projectKey}/decisions`}
        linkLabel="결정 대기 목록으로 돌아가기"
      />
    );
  }

  return <DecisionDetail detail={detail} backHref={`/projects/${projectKey}/decisions`} />;
}
