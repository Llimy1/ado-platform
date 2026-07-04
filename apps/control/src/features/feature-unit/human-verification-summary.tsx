import Link from "next/link";
import panelStyles from "./component-work-matrix.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

const STATE_LABEL: Record<FeatureUnitDetailResponse["humanVerification"]["state"], string> = {
  not_available: "해당 없음",
  pending: "대기 중",
  in_progress: "진행 중",
  passed: "통과",
  failed: "실패",
};

const STATE_TONE: Record<FeatureUnitDetailResponse["humanVerification"]["state"], "queued" | "warning" | "running" | "success" | "failure"> = {
  not_available: "queued",
  pending: "warning",
  in_progress: "running",
  passed: "success",
  failed: "failure",
};

/** P-04.4: human verification checklist summary; marking checkboxes alone has no state effect. */
export function HumanVerificationSummary({
  humanVerification,
}: {
  humanVerification: FeatureUnitDetailResponse["humanVerification"];
}) {
  return (
    <Panel title="사람 검증" headingId="human-verification-heading">
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ado-space-3)", marginBottom: "var(--ado-space-3)" }}>
        <StatusBadge tone={STATE_TONE[humanVerification.state]} label={STATE_LABEL[humanVerification.state]} />
      </div>
      {humanVerification.state === "not_available" ? (
        <p className={panelStyles.muted}>이 Feature Unit은 아직 사람 검증 단계에 도달하지 않았습니다.</p>
      ) : (
        <p className={panelStyles.muted}>
          필수 항목 {humanVerification.passedRequiredItemCount}/{humanVerification.requiredItemCount} 통과
          {humanVerification.failedRequiredItemCount > 0 ? ` · 실패 ${humanVerification.failedRequiredItemCount}건` : ""}
        </p>
      )}
      {humanVerification.href ? <Link href={humanVerification.href}>사람 검증 페이지로 이동</Link> : null}
    </Panel>
  );
}
