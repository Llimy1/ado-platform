import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { formatAbsoluteTime } from "@/lib/format";
import type { HumanVerificationResponse } from "@/lib/contracts/human-verification";

const DISABLED_REASON = "프로토타입 - 백엔드 명령이 연동되어 있지 않아 실행되지 않습니다.";

/**
 * P-08.3/.4 final human decision panel: enabled only by server projection
 * (`gate.finalDecisionEligible`), never by client checkbox counts. This
 * prototype has no backend to accept the decision, so both commands render
 * disabled regardless of eligibility, with the real gate reason surfaced as
 * text.
 */
export function FinalDecisionPanel({
  gate,
  finalDecision,
}: {
  gate: HumanVerificationResponse["gate"];
  finalDecision: HumanVerificationResponse["finalDecision"];
}) {
  return (
    <Panel title="최종 인간 검증 결정" headingId="final-decision-heading">
      {finalDecision.decision ? (
        <>
          <div style={{ marginBottom: "var(--ado-space-3)" }}>
            <StatusBadge
              tone={finalDecision.decision === "human_verified" ? "success" : "warning"}
              label={finalDecision.decision === "human_verified" ? "인간 검증 완료" : "수정 요청됨"}
            />
          </div>
          <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)" }}>
            {finalDecision.actorLabel} · {finalDecision.decidedAt ? formatAbsoluteTime(finalDecision.decidedAt) : "-"}
          </p>
          {finalDecision.reason ? (
            <p style={{ fontSize: "var(--ado-text-dense-size)", marginTop: "var(--ado-space-2)" }}>{finalDecision.reason}</p>
          ) : null}
        </>
      ) : (
        <>
          <div style={{ marginBottom: "var(--ado-space-3)" }}>
            <StatusBadge
              tone={gate.finalDecisionEligible ? "success" : "warning"}
              label={gate.finalDecisionEligible ? "최종 결정 가능" : "최종 결정 불가"}
            />
          </div>
          <div style={{ display: "flex", gap: "var(--ado-space-3)", flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary" disabled title={DISABLED_REASON}>
              인간 검증 승인
            </Button>
            <Button variant="danger" disabled title={DISABLED_REASON}>
              수정 요청
            </Button>
            <span style={{ fontSize: "var(--ado-text-label-size)", color: "var(--ado-color-text-tertiary)" }}>{DISABLED_REASON}</span>
          </div>
        </>
      )}
    </Panel>
  );
}
