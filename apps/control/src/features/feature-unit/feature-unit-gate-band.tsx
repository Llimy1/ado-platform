import styles from "./feature-unit-gate-band.module.css";
import { Button } from "@/components/Button";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

const PLANNING_EXPLANATION: Record<string, string> = {
  awaiting_human_planning_approval: "사람의 계획 승인이 필요합니다.",
  spec_not_yet_ready: "아직 사람 검토를 받을 준비가 되지 않았습니다 (Spec 초안 단계).",
  not_applicable_for_current_state: "현재 상태에서는 계획 결정이 필요하지 않습니다.",
};

const ACTIVATION_EXPLANATION: Record<string, string> = {
  planning_not_yet_approved: "계획이 아직 승인되지 않아 실행을 시작할 수 없습니다.",
  blocked_by_open_incident: "진행 중인 사고 또는 일시정지로 인해 실행이 차단되어 있습니다.",
  no_blocking_condition: "차단 조건이 없습니다.",
};

/**
 * P-04.4 gate bands: distinguishes the Planning gate ("may this Unit be
 * approved as intended scope?") from the Activation gate ("may approved
 * work start without violating dependency or safety policy?"). The browser
 * cannot activate a Feature Unit directly — activation is automatic once
 * gates pass — so only the planning decision has (disabled, mock-only)
 * buttons here.
 */
export function FeatureUnitGateBand({ detail }: { detail: FeatureUnitDetailResponse }) {
  const { planningGate, activationGate } = detail;
  const showPlanning = planningGate.state !== "approved";
  const showActivation = activationGate.state !== "active";
  const disabledReason = "프로토타입 - 백엔드 명령이 연동되어 있지 않아 실행되지 않습니다.";

  return (
    <>
      {showPlanning ? (
        <div className={[styles.band, planningGate.state === "blocked" ? styles.blocked : ""].join(" ")}>
          <p className={styles.bandTitle}>계획 게이트: 이 Unit을 의도한 범위로 승인해도 되는가?</p>
          <p className={styles.bandBody}>{PLANNING_EXPLANATION[planningGate.explanationCode] ?? planningGate.explanationCode}</p>
          <div className={styles.actions}>
            <Button variant="primary" disabled title={disabledReason}>
              승인
            </Button>
            <Button variant="secondary" disabled title={disabledReason}>
              변경 요청
            </Button>
            <span className={styles.disabledReason}>{disabledReason}</span>
          </div>
        </div>
      ) : null}

      {showActivation ? (
        <div className={[styles.band, activationGate.state === "blocked" ? styles.blocked : ""].join(" ")}>
          <p className={styles.bandTitle}>실행 게이트: 승인된 작업이 의존성·안전 정책을 위반하지 않고 시작할 수 있는가?</p>
          <p className={styles.bandBody}>
            {ACTIVATION_EXPLANATION[activationGate.explanationCode] ?? activationGate.explanationCode}
            {activationGate.unmetDependencyCount > 0
              ? ` 미충족 선행 조건 ${activationGate.unmetDependencyCount}건.`
              : ""}
            {activationGate.waivedDependencyCount > 0 ? ` 면제된 선행 조건 ${activationGate.waivedDependencyCount}건.` : ""}
          </p>
          <p className={styles.disabledReason}>
            승인된 작업이 있어도 실행은 의존성과 안전 게이트를 모두 통과한 뒤 자동으로 시작됩니다. 브라우저에서 직접
            실행을 시작할 수 없습니다.
          </p>
        </div>
      ) : null}
    </>
  );
}
