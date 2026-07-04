import styles from "./agent-run-table.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, formatAbsoluteTime } from "@/lib/format";
import type { JobAttemptDetailResponse } from "@/lib/contracts/job-attempt";

/** P-06.3: CommandRun table; stdout/stderr availability is surfaced, not the raw text itself. */
export function CommandRunTable({ commandRuns }: { commandRuns: JobAttemptDetailResponse["commandRuns"] }) {
  return (
    <Panel title="CommandRun" headingId="command-run-table-heading">
      {commandRuns.length === 0 ? (
        <EmptyState title="실행된 명령이 없습니다." />
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>CommandRun 목록, {commandRuns.length}건 표시 중</caption>
            <thead>
              <tr>
                <th scope="col">명령</th>
                <th scope="col">State</th>
                <th scope="col">Exit code</th>
                <th scope="col">시작 / 종료</th>
                <th scope="col">출력</th>
              </tr>
            </thead>
            <tbody>
              {commandRuns.map((cr) => (
                <tr key={cr.commandRunId} id={`command-run-${cr.commandRunId}`}>
                  <td className="ado-mono">{cr.commandKey}</td>
                  <td>
                    <StatusBadge tone={LIFECYCLE_STATE_TONE[cr.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[cr.state] ?? cr.state} />
                  </td>
                  <td>{cr.timedOut ? "타임아웃" : (cr.exitCode ?? "-")}</td>
                  <td>
                    {formatAbsoluteTime(cr.startedAt)} / {cr.finishedAt ? formatAbsoluteTime(cr.finishedAt) : "-"}
                  </td>
                  <td>
                    {cr.stdoutAvailable ? "stdout" : ""} {cr.stderrAvailable ? "stderr" : ""}
                    {!cr.stdoutAvailable && !cr.stderrAvailable ? <span className={styles.muted}>없음</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
