import Link from "next/link";
import styles from "./incident-list.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { INCIDENT_SEVERITY_LABEL, INCIDENT_SEVERITY_TONE, INCIDENT_STATE_LABEL, INCIDENT_STATE_TONE, formatRelativeTime, formatAbsoluteTime } from "@/lib/format";
import type { IncidentListResponse } from "@/lib/contracts/incident";

type Item = IncidentListResponse["items"][number];

/** P-09.2: global incident list. Severity is text/icon/color, never color alone. */
export function IncidentList({ response }: { response: IncidentListResponse }) {
  const { items, summary } = response;

  return (
    <Panel title="사고 목록" headingId="incident-list-heading">
      <p className={styles.summaryBar} role="status">
        <span>진행 중 {summary.openCount}건</span>
        <span>긴급 {summary.criticalCount}건</span>
      </p>
      {items.length === 0 ? (
        <EmptyState title="진행 중인 사고가 없습니다." />
      ) : (
        <>
          <div className="ado-show-desktop-table">
            <IncidentTable items={items} />
          </div>
          <div className="ado-show-mobile-cards">
            <IncidentCards items={items} />
          </div>
        </>
      )}
    </Panel>
  );
}

function IncidentTable({ items }: { items: Item[] }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>사고 목록, {items.length}건 표시 중</caption>
        <thead>
          <tr>
            <th scope="col">사고</th>
            <th scope="col">프로젝트</th>
            <th scope="col">심각도</th>
            <th scope="col">상태</th>
            <th scope="col">개설 시각</th>
            <th scope="col">영향 범위</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.incidentKey}>
              <td>
                <Link href={item.href}>{item.title}</Link>
              </td>
              <td>{item.projectName}</td>
              <td>
                <StatusBadge tone={INCIDENT_SEVERITY_TONE[item.severity]} label={INCIDENT_SEVERITY_LABEL[item.severity]} />
              </td>
              <td>
                <StatusBadge tone={INCIDENT_STATE_TONE[item.state]} label={INCIDENT_STATE_LABEL[item.state]} />
              </td>
              <td>
                <time dateTime={item.openedAt} title={formatAbsoluteTime(item.openedAt)}>
                  {formatRelativeTime(item.openedAt)}
                </time>
              </td>
              <td>{item.affectedSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IncidentCards({ items }: { items: Item[] }) {
  return (
    <ul className={styles.cardList}>
      {items.map((item) => (
        <li key={item.incidentKey} className={styles.card}>
          <div className={styles.cardTop}>
            <Link href={item.href}>{item.title}</Link>
            <StatusBadge tone={INCIDENT_SEVERITY_TONE[item.severity]} label={INCIDENT_SEVERITY_LABEL[item.severity]} />
          </div>
          <span>{item.projectName}</span>
          <StatusBadge tone={INCIDENT_STATE_TONE[item.state]} label={INCIDENT_STATE_LABEL[item.state]} />
          <span>개설: {formatRelativeTime(item.openedAt)}</span>
          <span>{item.affectedSummary}</span>
        </li>
      ))}
    </ul>
  );
}
