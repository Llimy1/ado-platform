import Link from "next/link";
import styles from "./incident-detail.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { MachineValue } from "@/components/MachineValue";
import { EventTimeline } from "@/components/EventTimeline";
import { EmptyState } from "@/components/StateViews";
import { INCIDENT_SEVERITY_LABEL, INCIDENT_SEVERITY_TONE, INCIDENT_STATE_LABEL, INCIDENT_STATE_TONE, formatAbsoluteTime } from "@/lib/format";
import type { IncidentAllowedAction, IncidentDetailResponse } from "@/lib/contracts/incident";

const ACTION_LABEL: Record<IncidentAllowedAction, string> = {
  acknowledge: "확인 기록",
  request_recovery: "복구 요청",
};

const DISABLED_REASON = "프로토타입 - 백엔드 명령이 연동되어 있지 않아 실행되지 않습니다.";

/**
 * P-09.2 incident detail: state and scope first, recovery evidence second,
 * then an immutable timeline. `acknowledge` records human awareness only —
 * it never resumes automation. `request_recovery` cannot itself close the
 * incident, clear the SafetyEvent, resume a Worker, or reclassify severity;
 * the server decides whether recovery is allowed.
 */
export function IncidentDetail({ detail, backHref }: { detail: IncidentDetailResponse; backHref: string }) {
  const { incident, safetyEvent, affected, activePauseRecords, recoveryEvidence, decisions, timeline, allowedActions } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={backHref}>사고 목록으로 돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{incident.title}</h1>
          <StatusBadge tone={INCIDENT_SEVERITY_TONE[incident.severity]} label={INCIDENT_SEVERITY_LABEL[incident.severity]} />
          <StatusBadge tone={INCIDENT_STATE_TONE[incident.state]} label={INCIDENT_STATE_LABEL[incident.state]} />
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>incidentKey</span>
            <MachineValue value={incident.incidentKey} label="incidentKey" />
          </span>
          <span>
            <span className={styles.metaLabel}>프로젝트</span>
            {incident.projectName}
          </span>
          <span>
            <span className={styles.metaLabel}>개설 시각</span>
            {formatAbsoluteTime(incident.openedAt)}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <Panel title="안전 이벤트 및 영향 범위" headingId="incident-scope-heading">
          <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)", marginBottom: "var(--ado-space-3)" }}>{safetyEvent.summary}</p>

          <p className={styles.scopeGroupLabel}>영향받은 Feature Unit</p>
          {affected.featureUnits.length === 0 ? (
            <EmptyState title="영향받은 Feature Unit이 없습니다." />
          ) : (
            <ul className={styles.scopeList}>
              {affected.featureUnits.map((f) => (
                <li key={f.featureUnitKey} className={styles.scopeRow}>
                  <Link href={f.href}>{f.title}</Link>
                </li>
              ))}
            </ul>
          )}

          <p className={styles.scopeGroupLabel}>영향받은 Component Work</p>
          {affected.componentWorks.length === 0 ? (
            <EmptyState title="영향받은 Component Work가 없습니다." />
          ) : (
            <ul className={styles.scopeList}>
              {affected.componentWorks.map((c) => (
                <li key={c.componentWorkKey} className={styles.scopeRow}>
                  <Link href={c.href}>{c.title}</Link>
                </li>
              ))}
            </ul>
          )}

          <p className={styles.scopeGroupLabel}>활성 PauseRecord</p>
          {activePauseRecords.length === 0 ? (
            <EmptyState title="활성 PauseRecord가 없습니다." />
          ) : (
            <ul className={styles.scopeList}>
              {activePauseRecords.map((p) => (
                <li key={p.pauseRecordKey} className={styles.scopeRow}>
                  {p.scopeLabel} — {p.reason} ({p.pausedByLabel}, {formatAbsoluteTime(p.pausedAt)})
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="복구 근거" headingId="incident-recovery-heading">
          <p className={styles.scopeGroupLabel}>필요한 복구 근거</p>
          <ul className={styles.scopeList}>
            {recoveryEvidence.required.map((r) => (
              <li key={r} className={styles.scopeRow}>
                {r}
              </li>
            ))}
          </ul>
          <p className={styles.scopeGroupLabel}>제출된 근거</p>
          {recoveryEvidence.submitted.length === 0 ? (
            <EmptyState title="아직 제출된 복구 근거가 없습니다." />
          ) : (
            <ul className={styles.scopeList}>
              {recoveryEvidence.submitted.map((s) => (
                <li key={s.href} className={styles.scopeRow}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          )}
          {decisions.length > 0 ? (
            <>
              <p className={styles.scopeGroupLabel}>관련 결정</p>
              <ul className={styles.scopeList}>
                {decisions.map((d) => (
                  <li key={d.decisionKey} className={styles.scopeRow}>
                    <Link href={d.href}>{d.title}</Link>
                    <span style={{ color: "var(--ado-color-text-tertiary)" }}>{d.status}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Panel>
      </div>

      {allowedActions.length > 0 ? (
        <div className={styles.section}>
          <Panel title="명령" headingId="incident-commands-heading">
            <div className={styles.commandStrip}>
              {allowedActions.map((action) => (
                <Button key={action} variant={action === "request_recovery" ? "primary" : "secondary"} disabled title={DISABLED_REASON}>
                  {ACTION_LABEL[action]}
                </Button>
              ))}
              <span className={styles.disabledReason}>{DISABLED_REASON}</span>
            </div>
          </Panel>
        </div>
      ) : null}

      <div className={styles.section}>
        <EventTimeline
          title="사고 이력"
          headingId="incident-timeline-heading"
          emptyTitle="기록된 사고 이력이 없습니다."
          omittedCount={timeline.omittedCount}
          items={timeline.items.map((ev) => ({
            eventKey: ev.eventKey,
            occurredAt: ev.occurredAt,
            metaText: ev.actorLabel,
            summary: ev.summary,
            evidenceHref: ev.evidenceHref,
          }))}
        />
      </div>
    </div>
  );
}
