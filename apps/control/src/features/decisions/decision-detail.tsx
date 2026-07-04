import Link from "next/link";
import styles from "./decision-detail.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { MachineValue } from "@/components/MachineValue";
import { ATTENTION_SEVERITY_LABEL, ATTENTION_SEVERITY_TONE, DECISION_STATUS_LABEL, DECISION_STATUS_TONE, formatAbsoluteTime } from "@/lib/format";
import type { DecisionDetailResponse } from "@/lib/contracts/decision";

/**
 * P-09.1 decision detail: full evidence manifest plus the allowed choices
 * as informational text, never a generic approve/reject control. Planning,
 * Feature Unit, verification, pause, recovery, and incident decisions each
 * use their owning page's own command schema — this page routes there
 * rather than duplicating it.
 */
export function DecisionDetail({ detail, backHref }: { detail: DecisionDetailResponse; backHref: string }) {
  const { decision, gateSummary, evidenceManifest, allowedChoices, resolution, priorDecisionHref, supersedingDecisionHref } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={backHref}>결정 대기 목록으로 돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{decision.target.title}</h1>
          <StatusBadge tone={DECISION_STATUS_TONE[decision.status]} label={DECISION_STATUS_LABEL[decision.status]} />
          <StatusBadge tone={ATTENTION_SEVERITY_TONE[decision.severity]} label={ATTENTION_SEVERITY_LABEL[decision.severity]} />
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>decisionKey</span>
            <MachineValue value={decision.decisionKey} label="decisionKey" />
          </span>
          <span>
            <span className={styles.metaLabel}>결정 유형</span>
            {decision.decisionType}
          </span>
          <span>
            <span className={styles.metaLabel}>요청자</span>
            {decision.requestedActor}
          </span>
          <span>
            <span className={styles.metaLabel}>요청 시각</span>
            {formatAbsoluteTime(decision.requestedAt)}
          </span>
          {decision.dueAt ? (
            <span>
              <span className={styles.metaLabel}>기한</span>
              {formatAbsoluteTime(decision.dueAt)}
            </span>
          ) : null}
        </div>
      </div>

      {resolution.choiceKey === null ? (
        <p className={styles.routingNotice}>
          이 결정은 아래 대상 화면의 고유한 명령으로만 기록됩니다. 이 목록은 근거를 모아 보여주고 대상 화면으로 안내할 뿐, 자체 승인/거부 컨트롤을 제공하지 않습니다.
        </p>
      ) : (
        <p className={styles.routingNotice}>
          {resolution.actorLabel} · {resolution.decidedAt ? formatAbsoluteTime(resolution.decidedAt) : "-"}에 &ldquo;{allowedChoices.find((c) => c.choiceKey === resolution.choiceKey)?.label ?? resolution.choiceKey}&rdquo;(으)로 기록되었습니다.
          {resolution.reason ? ` 사유: ${resolution.reason}` : ""}
        </p>
      )}

      <div className={styles.section}>
        <Panel title="게이트 요약" headingId="decision-gate-summary-heading">
          <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)", marginBottom: "var(--ado-space-3)" }}>{gateSummary}</p>
          <Link href={decision.target.href}>{decision.target.title} 화면에서 처리</Link>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="증거 목록" headingId="decision-evidence-heading">
          <ul className={styles.evidenceList}>
            {evidenceManifest.map((e) => (
              <li key={e.href} className={styles.evidenceRow}>
                <Link href={e.href}>{e.label}</Link>
                <span style={{ color: "var(--ado-color-text-tertiary)" }}>{e.kind}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="허용된 결정" headingId="decision-choices-heading">
          <ul className={styles.choiceList}>
            {allowedChoices.map((c) => (
              <li key={c.choiceKey}>
                {c.label}
                {c.reasonRequired ? " (사유 필수)" : ""}
              </li>
            ))}
          </ul>
          {(priorDecisionHref || supersedingDecisionHref) ? (
            <p style={{ marginTop: "var(--ado-space-3)", fontSize: "var(--ado-text-dense-size)" }}>
              {priorDecisionHref ? <Link href={priorDecisionHref}>이전 결정 보기</Link> : null}
              {priorDecisionHref && supersedingDecisionHref ? " · " : null}
              {supersedingDecisionHref ? <Link href={supersedingDecisionHref}>대체 결정 보기</Link> : null}
            </p>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
