import Link from "next/link";
import styles from "./decision-inbox.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { ATTENTION_SEVERITY_LABEL, ATTENTION_SEVERITY_TONE, formatAbsoluteTime, formatRelativeTime } from "@/lib/format";
import type { DecisionListResponse } from "@/lib/contracts/decision";

type Item = DecisionListResponse["items"][number];

function isExpired(dueAt: string | null): boolean {
  return dueAt !== null && new Date(dueAt).getTime() < Date.now();
}

/**
 * P-09.1 Decision Inbox: read-only rows routing to each decision's owning
 * context. There is no generic approve/reject control here — this list only
 * surfaces what requires a decision and where to make it.
 */
export function DecisionInbox({ response, showProjectColumn }: { response: DecisionListResponse; showProjectColumn: boolean }) {
  const { items, summary } = response;

  return (
    <Panel title="결정 대기 목록" headingId="decision-inbox-heading">
      <p className={styles.summaryBar} role="status">
        <span>대기 중 {summary.totalCount}건</span>
        <span>기한 초과 {summary.expiredCount}건</span>
        <span>긴급 {summary.criticalCount}건</span>
      </p>
      {items.length === 0 ? (
        <EmptyState title="대기 중인 결정이 없습니다." />
      ) : (
        <>
          <div className="ado-show-desktop-table">
            <DecisionTable items={items} showProjectColumn={showProjectColumn} />
          </div>
          <div className="ado-show-mobile-cards">
            <DecisionCards items={items} showProjectColumn={showProjectColumn} />
          </div>
        </>
      )}
    </Panel>
  );
}

function DecisionTable({ items, showProjectColumn }: { items: Item[]; showProjectColumn: boolean }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>결정 대기 목록, {items.length}건 표시 중</caption>
        <thead>
          <tr>
            <th scope="col">대상</th>
            {showProjectColumn ? <th scope="col">프로젝트</th> : null}
            <th scope="col">심각도</th>
            <th scope="col">요청 시각</th>
            <th scope="col">기한</th>
            <th scope="col">근거</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.decisionKey}>
              <td>
                <Link href={item.href}>{item.target.title}</Link>
                <span className={styles.muted} style={{ display: "block" }}>
                  {item.gateSummary}
                </span>
              </td>
              {showProjectColumn ? <td>{item.href.split("/")[2]}</td> : null}
              <td>
                <StatusBadge tone={ATTENTION_SEVERITY_TONE[item.severity]} label={ATTENTION_SEVERITY_LABEL[item.severity]} />
              </td>
              <td>
                <time dateTime={item.requestedAt} title={formatAbsoluteTime(item.requestedAt)}>
                  {formatRelativeTime(item.requestedAt)}
                </time>
              </td>
              <td className={isExpired(item.dueAt) ? styles.expired : undefined}>
                {item.dueAt ? formatAbsoluteTime(item.dueAt) : <span className={styles.muted}>없음</span>}
                {isExpired(item.dueAt) ? " (기한 초과)" : ""}
              </td>
              <td>
                <Link href={item.href}>보기</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DecisionCards({ items, showProjectColumn }: { items: Item[]; showProjectColumn: boolean }) {
  return (
    <ul className={styles.cardList}>
      {items.map((item) => (
        <li key={item.decisionKey} className={styles.card}>
          <div className={styles.cardTop}>
            <Link href={item.href}>{item.target.title}</Link>
            <StatusBadge tone={ATTENTION_SEVERITY_TONE[item.severity]} label={ATTENTION_SEVERITY_LABEL[item.severity]} />
          </div>
          <span>{item.gateSummary}</span>
          {showProjectColumn ? <span>프로젝트: {item.href.split("/")[2]}</span> : null}
          <span>요청: {formatRelativeTime(item.requestedAt)}</span>
          <span className={isExpired(item.dueAt) ? styles.expired : undefined}>
            기한: {item.dueAt ? formatAbsoluteTime(item.dueAt) : "없음"}
            {isExpired(item.dueAt) ? " (기한 초과)" : ""}
          </span>
          <Link href={item.href}>근거 보기</Link>
        </li>
      ))}
    </ul>
  );
}
