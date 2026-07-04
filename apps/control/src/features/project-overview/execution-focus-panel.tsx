import Link from "next/link";
import panelStyles from "./overview-panels.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAbsoluteTime } from "@/lib/format";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

/**
 * P-02.5 Execution Focus: distinguishes queued/running/near-timeout/no
 * eligible worker. No progress bar; elapsed time is not progress.
 */
export function ExecutionFocusPanel({
  executionFocus,
}: {
  executionFocus: ProjectOverviewResponse["executionFocus"];
}) {
  const { primary, capacity } = executionFocus;
  const now = new Date();
  const nearTimeout =
    primary &&
    new Date(primary.timeoutAt).getTime() - now.getTime() <
      0.2 * (new Date(primary.timeoutAt).getTime() - new Date(primary.startedAt).getTime());
  const noEligibleWorker = capacity.eligibleReadyWorkerCount === 0;

  return (
    <Panel title="실행 현황" headingId="execution-focus-heading">
      {primary ? (
        <div>
          <div className={panelStyles.row} style={{ borderBottom: "none" }}>
            <span className={panelStyles.itemTitle}>{primary.jobKey}</span>
            <StatusBadge
              tone={nearTimeout ? "warning" : "running"}
              label={nearTimeout ? "타임아웃 임박" : "실행 중"}
            />
          </div>
          <dl className={panelStyles.kvGrid}>
            <div>
              <span className={panelStyles.kvLabel}>Runner</span>
              {primary.runnerLabel}
            </div>
            <div>
              <span className={panelStyles.kvLabel}>Phase</span>
              {primary.phase}
            </div>
            <div>
              <span className={panelStyles.kvLabel}>시작</span>
              {formatAbsoluteTime(primary.startedAt)}
            </div>
            <div>
              <span className={panelStyles.kvLabel}>타임아웃 기한</span>
              {formatAbsoluteTime(primary.timeoutAt)}
            </div>
          </dl>
          <Link href={primary.href} className={panelStyles.footerLink}>
            Run 상세 보기
          </Link>
        </div>
      ) : (
        <p className={panelStyles.muted}>
          {capacity.queueDepthForProject > 0 ? "대기 중인 작업만 있습니다." : "실행 중인 attempt가 없습니다."}
        </p>
      )}
      <dl className={panelStyles.kvGrid} style={{ marginTop: "var(--ado-space-3)" }}>
        <div>
          <span className={panelStyles.kvLabel}>가용 Worker</span>
          {capacity.eligibleReadyWorkerCount}
        </div>
        <div>
          <span className={panelStyles.kvLabel}>저하된 Worker</span>
          {capacity.eligibleDegradedWorkerCount}
        </div>
        <div>
          <span className={panelStyles.kvLabel}>대기열 깊이</span>
          {capacity.queueDepthForProject}
        </div>
      </dl>
      {noEligibleWorker ? (
        <p style={{ color: "var(--ado-color-state-warning)", fontSize: "var(--ado-text-dense-size)", marginTop: "var(--ado-space-2)" }}>
          가용한 Worker가 없어 대기 중인 작업이 지연될 수 있습니다.
        </p>
      ) : null}
    </Panel>
  );
}
