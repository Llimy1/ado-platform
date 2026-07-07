import Link from "next/link";
import styles from "./job-attempt-detail-route.module.css";
import { AttemptSummary } from "./attempt-summary";
import { AgentRunTable } from "./agent-run-table";
import { CommandRunTable } from "./command-run-table";
import { RedactedArtifactList } from "./redacted-artifact-list";
import { AttemptLogReader } from "./attempt-log-reader";
import { MachineValue } from "@/components/MachineValue";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAbsoluteTime } from "@/lib/format";
import type { JobAttemptDetailResponse, LogStream, AttemptLogPageResponse } from "@/lib/contracts/job-attempt";

const STATE_LABEL: Record<string, string> = {
  queued: "대기 중",
  leased: "할당됨",
  running: "실행 중",
  succeeded: "성공",
  failed: "실패",
  timed_out: "타임아웃",
  cancelled: "취소됨",
  policy_denied: "정책 거부됨",
  blocked: "차단됨",
  human_required: "사람 확인 필요",
};

const STATE_TONE: Record<string, "queued" | "running" | "success" | "failure" | "warning"> = {
  queued: "queued",
  leased: "queued",
  running: "running",
  succeeded: "success",
  failed: "failure",
  timed_out: "warning",
  cancelled: "queued",
  policy_denied: "failure",
  blocked: "failure",
  human_required: "warning",
};

interface JobAttemptDetailRouteProps {
  detail: JobAttemptDetailResponse;
  activeStream: LogStream;
  logPage: AttemptLogPageResponse | null;
}

/**
 * P-06 Run Detail route (P-06.3). No commands here — retry/pause/cancel
 * live only on Component Work detail. This route is read-only history.
 */
export function JobAttemptDetailRoute({ detail, activeStream, logPage }: JobAttemptDetailRouteProps) {
  const { attempt, agentRuns, commandRuns, artifacts, runnerDataAvailable } = detail;
  const targetHref = attempt.job.target.uiHref;
  const targetLabel = attempt.job.target.label ?? attempt.job.target.ref;

  return (
    <div>
      <p className={styles.breadcrumb}>
        {targetHref ? <Link href={targetHref}>{targetLabel}로 돌아가기</Link> : <span>{targetLabel || "대상"} 화면 없음</span>}
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            {attempt.job.jobKey} #{attempt.attemptNumber}
          </h1>
          <StatusBadge tone={STATE_TONE[attempt.state] ?? "queued"} label={STATE_LABEL[attempt.state] ?? attempt.state} />
        </div>
        <p className={styles.terminalSummary}>
          exit code {attempt.terminal.exitCode ?? "없음"}
          {attempt.terminal.signal ? ` · signal ${attempt.terminal.signal}` : ""}
          {attempt.terminal.failureCode ? ` · ${attempt.terminal.failureCode}` : ""}
          {attempt.terminal.redactedSummary ? ` — ${attempt.terminal.redactedSummary}` : ""}
        </p>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>jobAttemptId</span>
            <MachineValue value={attempt.jobAttemptId} label="jobAttemptId" />
          </span>
          {attempt.resultArtifactHref ? <Link href={attempt.resultArtifactHref}>결과 Artifact 보기</Link> : null}
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <AttemptSummary attempt={attempt} />
      </div>
      <div className={styles.section}>
        <AgentRunTable agentRuns={agentRuns} available={runnerDataAvailable} />
      </div>
      <div className={styles.section}>
        <CommandRunTable commandRuns={commandRuns} available={runnerDataAvailable} />
      </div>
      <div className={styles.section}>
        <RedactedArtifactList artifacts={artifacts} available={runnerDataAvailable} />
      </div>
      <div className={styles.section}>
        <AttemptLogReader jobAttemptId={attempt.jobAttemptId} activeStream={activeStream} page={logPage} />
      </div>
    </div>
  );
}
