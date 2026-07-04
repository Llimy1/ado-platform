import { IncidentDetail } from "@/features/incidents/incident-detail";
import { DeniedState } from "@/components/StateViews";
import { getIncidentDetail } from "@/lib/data";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ projectKey: string; incidentKey: string }>;
}) {
  const { projectKey, incidentKey } = await params;
  const detail = getIncidentDetail(projectKey, incidentKey);

  if (!detail) {
    return (
      <DeniedState
        title="이 사고를 볼 수 있는 권한이 없거나 존재하지 않습니다."
        backHref="/incidents"
        linkLabel="사고 목록으로 돌아가기"
      />
    );
  }

  return <IncidentDetail detail={detail} backHref="/incidents" />;
}
