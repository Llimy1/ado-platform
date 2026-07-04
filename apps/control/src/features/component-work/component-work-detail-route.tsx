import Link from "next/link";
import styles from "./component-work-detail-route.module.css";
import { ComponentWorkCommandStrip } from "./component-work-command-strip";
import { ComponentWorkScopePanel } from "./component-work-scope-panel";
import { ActiveExecutionPanel } from "./active-execution-panel";
import { VerificationSummaryPanel } from "./verification-summary-panel";
import { ReviewSummaryPanel } from "./review-summary-panel";
import { JobAttemptHistory } from "./job-attempt-history";
import { PullRequestPanel } from "./pull-request-panel";
import { EventTimeline } from "@/components/EventTimeline";
import { MachineValue } from "@/components/MachineValue";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, RISK_LEVEL_LABEL, formatAbsoluteTime } from "@/lib/format";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";
import type { FeatureUnitRiskLevel } from "@/lib/contracts/feature-unit";

interface ComponentWorkDetailRouteProps {
  projectKey: string;
  projectName: string;
  roadmapKey: string;
  roadmapTitle: string;
  featureUnitKey: string;
  featureUnitTitle: string;
  detail: ComponentWorkDetailResponse;
}

/** P-05 Component Work detail route (P-05.4). Server-rendered composition of the section components. */
export function ComponentWorkDetailRoute({
  projectKey,
  projectName,
  roadmapKey,
  roadmapTitle,
  featureUnitKey,
  featureUnitTitle,
  detail,
}: ComponentWorkDetailRouteProps) {
  const { work, commandGate, activeExecution, verification, review, pullRequest, attempts, timeline } = detail;
  const featureUnitHref = `/projects/${projectKey}/roadmaps/${roadmapKey}/feature-units/${featureUnitKey}`;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/projects">Projects</Link> / <Link href={`/projects/${projectKey}`}>{projectName}</Link> /{" "}
        <Link href={`/projects/${projectKey}/roadmaps`}>Roadmaps</Link> /{" "}
        <Link href={`/projects/${projectKey}/roadmaps/${roadmapKey}`}>{roadmapTitle}</Link> /{" "}
        <Link href={featureUnitHref}>{featureUnitTitle}</Link> / {work.title}
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{work.title}</h1>
          <StatusBadge tone={LIFECYCLE_STATE_TONE[work.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[work.state] ?? work.state} />
        </div>
        <p className={styles.intent}>{work.intent}</p>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>componentWorkKey</span>
            <MachineValue value={work.componentWorkKey} label="componentWorkKey" />
          </span>
          <span>
            <span className={styles.metaLabel}>범위</span>
            {work.executionScope === "single" ? "단일" : "협업"}
          </span>
          <span>
            <span className={styles.metaLabel}>필수</span>
            {work.required ? "필수" : "선택"}
          </span>
          <span>
            <span className={styles.metaLabel}>위험도</span>
            {RISK_LEVEL_LABEL[work.riskLevel as FeatureUnitRiskLevel] ?? work.riskLevel}
          </span>
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <ComponentWorkCommandStrip commandGate={commandGate} />

      <div className={styles.topGrid}>
        <ComponentWorkScopePanel work={work} />
        <ActiveExecutionPanel execution={activeExecution} />
      </div>

      <div className={styles.middleGrid}>
        <VerificationSummaryPanel verification={verification} />
        <ReviewSummaryPanel review={review} />
      </div>

      <div className={styles.section}>
        <JobAttemptHistory attempts={attempts} />
      </div>

      {pullRequest ? (
        <div className={styles.section}>
          <PullRequestPanel pullRequest={pullRequest} />
        </div>
      ) : null}

      <div className={styles.section}>
        <EventTimeline
          title="이력"
          headingId="component-work-timeline-heading"
          emptyTitle="이력이 없습니다."
          omittedCount={timeline.omittedCount}
          items={timeline.items.map((ev) => ({
            eventKey: ev.eventKey,
            occurredAt: ev.occurredAt,
            metaText: "system",
            summary: ev.summary,
            evidenceHref: ev.evidenceHref,
          }))}
        />
      </div>
    </div>
  );
}
