import Link from "next/link";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { ArbiterDecisionValue, ReviewGroupDetailResponse } from "@/lib/contracts/review-group";

const DECISION_LABEL: Record<ArbiterDecisionValue, string> = {
  ready_for_pr: "PR 준비됨",
  needs_revision: "재작업 필요",
  human_required: "사람 확인 필요",
  blocked: "차단됨",
};

const DECISION_TONE: Record<ArbiterDecisionValue, "success" | "warning" | "failure"> = {
  ready_for_pr: "success",
  needs_revision: "warning",
  human_required: "warning",
  blocked: "failure",
};

/**
 * P-07.3: renders exactly one active Arbiter decision. "ready_for_pr"
 * permits the next evidence gate only — it is never shown as a merge
 * approval.
 */
export function ArbiterDecisionPanel({ decision }: { decision: ReviewGroupDetailResponse["arbiterDecision"] }) {
  return (
    <Panel title="Arbiter 결정" headingId="arbiter-decision-heading">
      {!decision ? (
        <EmptyState title="아직 Arbiter 결정이 없습니다." />
      ) : (
        <>
          <div style={{ marginBottom: "var(--ado-space-3)" }}>
            <StatusBadge tone={DECISION_TONE[decision.decision]} label={DECISION_LABEL[decision.decision]} />
          </div>
          <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)", marginBottom: "var(--ado-space-2)" }}>
            {decision.summary}
          </p>
          <p style={{ fontSize: "var(--ado-text-dense-size)" }}>
            미해결 승인 지적 {decision.unresolvedAcceptedFindingCount}건 · PR 생성 허용:{" "}
            {decision.prCreationPermitted ? "예" : "아니오"}
          </p>
          <p style={{ fontSize: "var(--ado-text-label-size)", color: "var(--ado-color-text-tertiary)", marginTop: "var(--ado-space-2)" }}>
            결정 시각: {formatAbsoluteTime(decision.decidedAt)}
            {decision.decisionArtifactHref ? (
              <>
                {" "}
                · <Link href={decision.decisionArtifactHref}>결정 근거 보기</Link>
              </>
            ) : null}
          </p>
        </>
      )}
    </Panel>
  );
}
