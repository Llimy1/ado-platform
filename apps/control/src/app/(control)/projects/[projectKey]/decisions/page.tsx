import { DecisionInbox } from "@/features/decisions/decision-inbox";
import { DeniedState } from "@/components/StateViews";
import { getDecisionList, getProjectOverview } from "@/lib/data";

export default async function ProjectDecisionsPage({
  params,
}: {
  params: Promise<{ projectKey: string }>;
}) {
  const { projectKey } = await params;
  const project = getProjectOverview(projectKey);

  if (!project) {
    return <DeniedState title="이 Project를 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" />;
  }

  const response = getDecisionList(projectKey);

  return (
    <div>
      <h1 style={{ fontSize: "var(--ado-text-page-title-size)", lineHeight: "var(--ado-text-page-title-line)", fontWeight: "var(--ado-text-page-title-weight)", marginBottom: "var(--ado-space-4)" }}>
        {project.project.name} — 결정 대기 목록
      </h1>
      <DecisionInbox response={response} showProjectColumn={false} />
    </div>
  );
}
