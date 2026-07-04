import styles from "./roadmap-planning-gate.module.css";
import { Button } from "@/components/Button";
import { ROADMAP_STATE_LABEL } from "@/lib/format";
import type { RoadmapDetailResponse } from "@/lib/contracts/roadmaps";

const EXPLANATION_LABEL: Record<string, string> = {
  awaiting_human_planning_approval: "사람의 계획 승인이 필요합니다.",
  analysis_required: "승인 전에 로드맵 분석이 먼저 완료되어야 합니다.",
  not_applicable_for_current_state: "현재 상태에서는 계획 결정이 필요하지 않습니다.",
  blocked_by_incident: "사고로 인해 계획 결정을 진행할 수 없습니다.",
};

/**
 * P-03.4 planning-gate panel: distinguishes the planning decision from the
 * later approved -> active state-machine gate, and shows evidence instead of
 * a bare "승인 필요" label. Decision commands are disabled — this prototype
 * has no backend to accept them, so they must not imply a real mutation.
 */
export function RoadmapPlanningGate({ detail }: { detail: RoadmapDetailResponse }) {
  const { roadmap, planningGate, featureUnits, dependencyMap } = detail;
  if (planningGate.state === "approved") return null;

  const isBlocked = planningGate.state === "blocked";
  const disabledReason = "프로토타입 - 백엔드 명령이 연동되어 있지 않아 실행되지 않습니다.";

  return (
    <div className={[styles.gate, isBlocked ? styles.blocked : ""].join(" ")}>
      <h2 className={styles.title}>계획 승인 게이트</h2>
      <div className={styles.rows}>
        <div>
          <span className={styles.rowLabel}>현재 상태</span>
          {ROADMAP_STATE_LABEL[roadmap.state]}
        </div>
        <div>
          <span className={styles.rowLabel}>필요 조건</span>
          {EXPLANATION_LABEL[planningGate.explanationCode] ?? planningGate.explanationCode}
        </div>
        <div>
          <span className={styles.rowLabel}>근거</span>
          로드맵 분석 {roadmap.source.sourceVersion} · Feature Unit {featureUnits.totalCount}개 · 의존성 관계{" "}
          {dependencyMap.edges.length}개
        </div>
        {planningGate.decisionRequirements.canApprove ? (
          <div>
            <span className={styles.rowLabel}>승인 시 효과</span>
            승인 이후에도 실행 전환(approved → active)은 승인된 Feature Unit이 하나 이상 있어야 가능합니다.
          </div>
        ) : null}
      </div>
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
  );
}
