import Link from "next/link";
import styles from "./agent-run-table.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { JobAttemptDetailResponse } from "@/lib/contracts/job-attempt";

/** P-06.4: "no AgentRun" is explicit — never fabricate model/provider data. */
export function AgentRunTable({ agentRuns }: { agentRuns: JobAttemptDetailResponse["agentRuns"] }) {
  return (
    <Panel title="AgentRun" headingId="agent-run-table-heading">
      {agentRuns.length === 0 ? (
        <EmptyState title="AgentRun 없음" />
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>AgentRun 목록, {agentRuns.length}건 표시 중</caption>
            <thead>
              <tr>
                <th scope="col">역할</th>
                <th scope="col">Provider / 모델</th>
                <th scope="col">State</th>
                <th scope="col">시작 / 종료</th>
                <th scope="col">산출물</th>
              </tr>
            </thead>
            <tbody>
              {agentRuns.map((run) => (
                <tr key={run.agentRunId} id={`agent-run-${run.agentRunId}`}>
                  <td>{run.role}</td>
                  <td className="ado-mono">
                    {run.provider} / {run.modelIdentifier}
                  </td>
                  <td>{run.state}</td>
                  <td>
                    {formatAbsoluteTime(run.startedAt)} / {run.finishedAt ? formatAbsoluteTime(run.finishedAt) : "-"}
                  </td>
                  <td>
                    {run.outputArtifactHref ? (
                      <Link href={run.outputArtifactHref}>보기</Link>
                    ) : (
                      <span className={styles.muted}>없음</span>
                    )}
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
