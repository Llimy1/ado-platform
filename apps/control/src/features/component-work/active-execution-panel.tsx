import Link from "next/link";
import styles from "./component-work-scope-panel.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAbsoluteTime } from "@/lib/format";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

const STATE_LABEL: Record<string, string> = {
  none: "실행 중인 attempt 없음",
  queued: "대기 중",
  leased: "할당됨",
  running: "실행 중",
  timed_out: "타임아웃",
  failed: "실패",
  human_required: "사람 확인 필요",
};

const STATE_TONE: Record<string, "queued" | "running" | "warning" | "failure"> = {
  none: "queued",
  queued: "queued",
  leased: "running",
  running: "running",
  timed_out: "warning",
  failed: "failure",
  human_required: "warning",
};

/**
 * P-05.4: distinguishes queued/leased/running/timed_out/failed/human_required.
 * Elapsed time is never rendered as a progress bar.
 */
export function ActiveExecutionPanel({ execution }: { execution: ComponentWorkDetailResponse["activeExecution"] }) {
  const nearTimeout =
    execution.timeoutAt &&
    execution.startedAt &&
    new Date(execution.timeoutAt).getTime() - new Date().getTime() <
      0.2 * (new Date(execution.timeoutAt).getTime() - new Date(execution.startedAt).getTime());

  return (
    <Panel title="실행 현황" headingId="active-execution-heading">
      <div style={{ marginBottom: "var(--ado-space-3)" }}>
        <StatusBadge tone={nearTimeout ? "warning" : STATE_TONE[execution.state]} label={nearTimeout ? "타임아웃 임박" : STATE_LABEL[execution.state]} />
      </div>
      {execution.jobAttemptId ? (
        <dl className={styles.kvGrid}>
          <div>
            <span className={styles.kvLabel}>Runner</span>
            {execution.runnerLabel ?? "-"}
          </div>
          <div>
            <span className={styles.kvLabel}>시작</span>
            {execution.startedAt ? formatAbsoluteTime(execution.startedAt) : "-"}
          </div>
          <div>
            <span className={styles.kvLabel}>타임아웃 기한</span>
            {execution.timeoutAt ? formatAbsoluteTime(execution.timeoutAt) : "-"}
          </div>
          <div>
            <span className={styles.kvLabel}>마지막 heartbeat</span>
            {execution.lastHeartbeatAt ? formatAbsoluteTime(execution.lastHeartbeatAt) : "-"}
          </div>
        </dl>
      ) : null}
      {execution.href ? (
        <Link href={execution.href} style={{ display: "block", marginTop: "var(--ado-space-3)" }}>
          Run 상세 보기
        </Link>
      ) : null}
    </Panel>
  );
}
