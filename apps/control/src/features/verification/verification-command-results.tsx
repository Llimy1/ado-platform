import Link from "next/link";
import styles from "./verification-command-results.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import type { VerificationRunDetailResponse } from "@/lib/contracts/verification-run";

type Command = VerificationRunDetailResponse["commands"][number];

function formatDuration(ms: number | null): string {
  if (ms === null) return "-";
  const sec = Math.round(ms / 1000);
  return sec >= 60 ? `${Math.floor(sec / 60)}분 ${sec % 60}초` : `${sec}초`;
}

/**
 * P-07.2: not_started/running/passed/failed/timed_out/blocked/
 * evidence_invalid are distinct. A green command never becomes an overall
 * claim — only the requiredPassed banner (rendered by the parent) is.
 */
export function VerificationCommandResults({ commands }: { commands: Command[] }) {
  return (
    <Panel title="검증 명령 결과" headingId="verification-command-results-heading">
      {commands.length === 0 ? (
        <EmptyState title="실행된 검증 명령이 없습니다." />
      ) : (
        <>
          <div className="ado-show-desktop-table">
            <CommandTable commands={commands} />
          </div>
          <div className="ado-show-mobile-cards">
            <CommandCards commands={commands} />
          </div>
        </>
      )}
    </Panel>
  );
}

function CommandTable({ commands }: { commands: Command[] }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>검증 명령 결과, {commands.length}건 표시 중</caption>
        <thead>
          <tr>
            <th scope="col">명령</th>
            <th scope="col">필수</th>
            <th scope="col">State</th>
            <th scope="col">Exit code</th>
            <th scope="col">소요 시간</th>
            <th scope="col">근거</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((c) => (
            <tr key={c.commandRunId}>
              <td className="ado-mono">{c.commandKey}</td>
              <td>{c.required ? "필수" : "선택"}</td>
              <td>
                <StatusBadge tone={LIFECYCLE_STATE_TONE[c.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[c.state] ?? c.state} />
              </td>
              <td>{c.timedOut ? "타임아웃" : (c.actualExitCode ?? "-")}</td>
              <td>{formatDuration(c.durationMs)}</td>
              <td>
                {c.evidenceHref ? <Link href={c.evidenceHref}>보기</Link> : <span className={styles.muted}>없음</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CommandCards({ commands }: { commands: Command[] }) {
  return (
    <ul className={styles.cardList}>
      {commands.map((c) => (
        <li key={c.commandRunId} className={styles.card}>
          <div className={styles.cardTop}>
            <span className="ado-mono">{c.commandKey}</span>
            <StatusBadge tone={LIFECYCLE_STATE_TONE[c.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[c.state] ?? c.state} />
          </div>
          <span>{c.required ? "필수" : "선택"}</span>
          <span>exit code: {c.timedOut ? "타임아웃" : (c.actualExitCode ?? "-")}</span>
          <span>소요 시간: {formatDuration(c.durationMs)}</span>
          {c.evidenceHref ? <Link href={c.evidenceHref}>근거 보기</Link> : null}
        </li>
      ))}
    </ul>
  );
}
