import Link from "next/link";
import styles from "./job-attempt-detail-route.module.css";
import { Panel } from "@/components/Panel";
import { formatAbsoluteTime } from "@/lib/format";
import type { JobAttemptDetailResponse } from "@/lib/contracts/job-attempt";

function formatDuration(ms: number | null): string {
  if (ms === null) return "-";
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}분 ${sec}초` : `${sec}초`;
}

/** P-06.3: timing and worker facts, separate from the terminal summary in the header. */
export function AttemptSummary({ attempt }: { attempt: JobAttemptDetailResponse["attempt"] }) {
  return (
    <Panel title="타이밍 및 Worker" headingId="attempt-summary-heading">
      <dl className={styles.kvGrid}>
        <div>
          <span className={styles.kvLabel}>Job</span>
          <Link href={attempt.job.targetHref}>{attempt.job.jobKey}</Link>
        </div>
        <div>
          <span className={styles.kvLabel}>Job 유형</span>
          {attempt.job.type}
        </div>
        <div>
          <span className={styles.kvLabel}>Worker</span>
          {attempt.worker ? attempt.worker.workerKey : "없음"}
        </div>
        <div>
          <span className={styles.kvLabel}>리스 만료</span>
          {attempt.lease.expiresAt ? formatAbsoluteTime(attempt.lease.expiresAt) : "-"}
        </div>
        <div>
          <span className={styles.kvLabel}>시작</span>
          {attempt.timing.startedAt ? formatAbsoluteTime(attempt.timing.startedAt) : "-"}
        </div>
        <div>
          <span className={styles.kvLabel}>종료</span>
          {attempt.timing.finishedAt ? formatAbsoluteTime(attempt.timing.finishedAt) : "-"}
        </div>
        <div>
          <span className={styles.kvLabel}>타임아웃 기한</span>
          {attempt.timing.timeoutAt ? formatAbsoluteTime(attempt.timing.timeoutAt) : "-"}
        </div>
        <div>
          <span className={styles.kvLabel}>소요 시간</span>
          {formatDuration(attempt.timing.durationMs)}
        </div>
      </dl>
      {attempt.replacementAttemptHref ? (
        <p style={{ marginTop: "var(--ado-space-3)" }}>
          <Link href={attempt.replacementAttemptHref}>대체 attempt 보기</Link>
        </p>
      ) : null}
    </Panel>
  );
}
