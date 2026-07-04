import Link from "next/link";
import styles from "./system-health.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAbsoluteTime, WORKER_HEALTH_STATE_LABEL, WORKER_HEALTH_STATE_TONE } from "@/lib/format";
import type { SystemHealthResponse } from "@/lib/contracts/system-health";

/**
 * P-10.2 system health: factual read-only counts with links to affected
 * records. No hostnames, PIDs, credentials, topology, or stack traces are
 * shown, and a single responsive HTTP endpoint never manufactures an
 * overall green status — each card reports its own signal independently.
 */
export function SystemHealth({ health }: { health: SystemHealthResponse }) {
  const { api, database, outbox, workers, activeLeaseCount, openIncidentCount } = health;

  return (
    <div>
      <div className={styles.cardGrid}>
        <div className={styles.healthCard}>
          <span className={styles.healthCardLabel}>API</span>
          <StatusBadge tone={api.ready ? "success" : "failure"} label={api.ready ? "준비됨" : "준비 안 됨"} />
          <span className={styles.muted}>{api.version}</span>
        </div>
        <div className={styles.healthCard}>
          <span className={styles.healthCardLabel}>DB 연결</span>
          <StatusBadge tone={database.connected ? "success" : "failure"} label={database.connected ? "연결됨" : "연결 끊김"} />
          <span className={styles.muted}>{database.latencyMs !== null ? `지연 시간 ${database.latencyMs}ms` : "지연 시간 알 수 없음"}</span>
        </div>
        <div className={styles.healthCard}>
          <span className={styles.healthCardLabel}>Outbox 지연</span>
          <span className={styles.healthCardValue}>{outbox.lagSeconds}초</span>
          <span className={styles.muted}>대기 {outbox.pendingCount}건</span>
        </div>
        <div className={styles.healthCard}>
          <span className={styles.healthCardLabel}>활성 리스 / 진행 중 사고</span>
          <span className={styles.healthCardValue}>{activeLeaseCount}</span>
          <Link href="/incidents">진행 중인 사고 {openIncidentCount}건</Link>
        </div>
      </div>

      <div className={styles.section}>
        <Panel title="Worker 상태" headingId="worker-status-heading">
          <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)", marginBottom: "var(--ado-space-3)" }}>
            준비됨 {workers.readyCount}건 · 저하됨 {workers.degradedCount}건
          </p>
          <div className="ado-show-desktop-table">
            <WorkerTable items={workers.items} />
          </div>
          <div className="ado-show-mobile-cards">
            <WorkerCards items={workers.items} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function WorkerTable({ items }: { items: SystemHealthResponse["workers"]["items"] }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>Worker 상태, {items.length}건 표시 중</caption>
        <thead>
          <tr>
            <th scope="col">Worker</th>
            <th scope="col">레이블</th>
            <th scope="col">런타임</th>
            <th scope="col">상태</th>
            <th scope="col">최근 하트비트</th>
            <th scope="col">활성 시도</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.workerKey}>
              <td className="ado-mono">{w.workerKey}</td>
              <td>{w.labels.join(", ")}</td>
              <td className="ado-mono">{w.runtimeVersion}</td>
              <td>
                <StatusBadge tone={WORKER_HEALTH_STATE_TONE[w.state]} label={WORKER_HEALTH_STATE_LABEL[w.state]} />
              </td>
              <td>{w.lastHeartbeatAt ? formatAbsoluteTime(w.lastHeartbeatAt) : <span className={styles.muted}>없음</span>}</td>
              <td>{w.activeAttempt ? <Link href={w.activeAttempt.href}>{w.activeAttempt.jobAttemptId}</Link> : <span className={styles.muted}>없음</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkerCards({ items }: { items: SystemHealthResponse["workers"]["items"] }) {
  return (
    <ul className={styles.cardList}>
      {items.map((w) => (
        <li key={w.workerKey} className={styles.card}>
          <div className={styles.cardTop}>
            <span className="ado-mono">{w.workerKey}</span>
            <StatusBadge tone={WORKER_HEALTH_STATE_TONE[w.state]} label={WORKER_HEALTH_STATE_LABEL[w.state]} />
          </div>
          <span>{w.labels.join(", ")} · {w.runtimeVersion}</span>
          <span>최근 하트비트: {w.lastHeartbeatAt ? formatAbsoluteTime(w.lastHeartbeatAt) : "없음"}</span>
          {w.activeAttempt ? <Link href={w.activeAttempt.href}>활성 시도: {w.activeAttempt.jobAttemptId}</Link> : <span className={styles.muted}>활성 시도 없음</span>}
        </li>
      ))}
    </ul>
  );
}
