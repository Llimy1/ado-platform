import Link from "next/link";
import styles from "./job-attempt-history.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, formatAbsoluteTime } from "@/lib/format";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

type Attempt = ComponentWorkDetailResponse["attempts"]["items"][number];

/**
 * P-05.4/P-05.5: native table at 1280px+, cards below 1024px. Keeps at most
 * 20 records with an explicit history route (not implemented in this
 * prototype — omittedCount is surfaced as text instead).
 */
export function JobAttemptHistory({ attempts }: { attempts: ComponentWorkDetailResponse["attempts"] }) {
  return (
    <Panel title="Attempt 이력" headingId="job-attempt-history-heading">
      {attempts.items.length === 0 ? (
        <EmptyState title="기록된 attempt가 없습니다." />
      ) : (
        <>
          <div className="ado-show-desktop-table">
            <AttemptTable items={attempts.items} />
          </div>
          <div className="ado-show-mobile-cards">
            <AttemptCards items={attempts.items} />
          </div>
        </>
      )}
      {attempts.omittedCount > 0 ? (
        <p className={styles.muted} style={{ marginTop: "var(--ado-space-3)" }}>
          그 외 {attempts.omittedCount}건 더 있음
        </p>
      ) : null}
    </Panel>
  );
}

function AttemptTable({ items }: { items: Attempt[] }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>Attempt 이력, {items.length}건 표시 중</caption>
        <thead>
          <tr>
            <th scope="col">시도</th>
            <th scope="col">State</th>
            <th scope="col">Worker</th>
            <th scope="col">시작 / 종료</th>
            <th scope="col">실패 요약</th>
            <th scope="col">
              <span className="ado-visually-hidden">열기</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.jobAttemptId}>
              <td>#{a.attemptNumber}</td>
              <td>
                <StatusBadge tone={LIFECYCLE_STATE_TONE[a.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[a.state] ?? a.state} />
              </td>
              <td>{a.workerLabel ?? <span className={styles.muted}>없음</span>}</td>
              <td>
                {a.startedAt ? formatAbsoluteTime(a.startedAt) : "-"} / {a.finishedAt ? formatAbsoluteTime(a.finishedAt) : "-"}
              </td>
              <td>{a.redactedSummary ?? <span className={styles.muted}>없음</span>}</td>
              <td>
                <Link href={a.href}>Run 열기</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AttemptCards({ items }: { items: Attempt[] }) {
  return (
    <ul className={styles.cardList}>
      {items.map((a) => (
        <li key={a.jobAttemptId} className={styles.card}>
          <div className={styles.cardTop}>
            <span>#{a.attemptNumber}</span>
            <StatusBadge tone={LIFECYCLE_STATE_TONE[a.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[a.state] ?? a.state} />
          </div>
          <span>Worker: {a.workerLabel ?? "없음"}</span>
          <span>
            {a.startedAt ? formatAbsoluteTime(a.startedAt) : "-"} ~ {a.finishedAt ? formatAbsoluteTime(a.finishedAt) : "-"}
          </span>
          {a.redactedSummary ? <span className={styles.muted}>{a.redactedSummary}</span> : null}
          <Link href={a.href}>Run 열기</Link>
        </li>
      ))}
    </ul>
  );
}
