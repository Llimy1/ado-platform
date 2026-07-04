import Link from "next/link";
import styles from "./human-verification-route.module.css";
import { ChecklistTable } from "./checklist-table";
import { FinalDecisionPanel } from "./final-decision-panel";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EventTimeline } from "@/components/EventTimeline";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, formatAbsoluteTime } from "@/lib/format";
import type { HumanVerificationResponse } from "@/lib/contracts/human-verification";

const GATE_EXPLANATION_LABEL: Record<string, string> = {
  required_items_remaining: "필수 체크리스트 항목이 아직 남아 있어 최종 결정을 내릴 수 없습니다.",
  pr_evidence_missing: "필수 PR 근거가 아직 모두 확인되지 않았습니다.",
  incident_or_pause_blocking: "진행 중인 인시던트 또는 일시정지로 인해 최종 결정이 차단되었습니다.",
};

/**
 * P-08.3/.4 human verification route: header, gate explanation, required
 * checklist, optional checklist disclosure, final decision panel,
 * append-only result timeline — in that order. Feature Unit scoped, not
 * Component Work scoped, because cross-component behavior cannot be
 * proven by a single Component Work PR.
 */
export function HumanVerificationRoute({
  detail,
  featureUnitHref,
}: {
  detail: HumanVerificationResponse;
  featureUnitHref: string;
}) {
  const { featureUnit, gate, requiredPrLinks, checklist, resultHistory, finalDecision } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={featureUnitHref}>Feature Unit으로 돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>인간 검증: {featureUnit.title}</h1>
          <StatusBadge tone={LIFECYCLE_STATE_TONE[featureUnit.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[featureUnit.state] ?? featureUnit.state} />
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>featureUnitKey</span>
            {featureUnit.featureUnitKey}
          </span>
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <Panel title="필수 PR 근거" headingId="required-pr-links-heading">
          <ul className={styles.prLinkList}>
            {requiredPrLinks.map((pr) => (
              <li key={pr.componentWorkKey} className={styles.prLinkRow}>
                <Link href={pr.href}>PR #{pr.pullRequestId}</Link>
                <span>{pr.title}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className={styles.section}>
        <Panel title="게이트 상태" headingId="gate-explanation-heading">
          <div style={{ marginBottom: "var(--ado-space-2)" }}>
            <StatusBadge
              tone={gate.finalDecisionEligible ? "success" : "warning"}
              label={gate.finalDecisionEligible ? "최종 결정 가능" : "최종 결정 불가"}
            />
          </div>
          <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)" }}>
            {GATE_EXPLANATION_LABEL[gate.explanationCode] ?? gate.explanationCode} (남은 필수 항목: {gate.requiredItemsRemaining}건)
          </p>
        </Panel>
      </div>

      <div className={styles.section}>
        <ChecklistTable title="필수 체크리스트" headingId="required-checklist-heading" items={checklist.required} emptyTitle="필수 체크리스트 항목이 없습니다." />
      </div>

      <div className={styles.section}>
        <details className={styles.disclosure}>
          <summary>선택 체크리스트 ({checklist.optional.length}건)</summary>
          <ChecklistTable title="선택 체크리스트" headingId="optional-checklist-heading" items={checklist.optional} emptyTitle="선택 체크리스트 항목이 없습니다." />
        </details>
      </div>

      <div className={styles.section}>
        <FinalDecisionPanel gate={gate} finalDecision={finalDecision} />
      </div>

      <div className={styles.section}>
        <EventTimeline
          title="검증 결과 이력"
          headingId="result-history-heading"
          emptyTitle="기록된 검증 결과가 없습니다."
          omittedCount={resultHistory.omittedCount}
          items={resultHistory.items.map((ev) => ({
            eventKey: ev.eventKey,
            occurredAt: ev.occurredAt,
            metaText: `${ev.actorLabel} · ${ev.itemTitle}`,
            summary: ev.result === "passed" ? "통과" : ev.result === "failed" ? "실패" : "건너뜀",
            evidenceHref: ev.evidenceHref,
          }))}
        />
      </div>
    </div>
  );
}
