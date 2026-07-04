import Link from "next/link";
import styles from "./feature-unit-detail-route.module.css";
import { FeatureUnitGateBand } from "./feature-unit-gate-band";
import { AcceptanceCriteriaTable } from "./acceptance-criteria-table";
import { AcceptanceCriteriaCards } from "./acceptance-criteria-cards";
import { FeatureDependencyLists } from "./feature-dependency-lists";
import { ComponentWorkMatrix } from "./component-work-matrix";
import { ComponentContractList } from "./component-contract-list";
import { HumanVerificationSummary } from "./human-verification-summary";
import { FeatureUnitTimeline } from "./feature-unit-timeline";
import { Panel } from "@/components/Panel";
import { MachineValue } from "@/components/MachineValue";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime, LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, RISK_LEVEL_LABEL } from "@/lib/format";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

interface FeatureUnitDetailRouteProps {
  projectKey: string;
  projectName: string;
  roadmapKey: string;
  roadmapTitle: string;
  detail: FeatureUnitDetailResponse;
}

/** P-04 Feature Unit detail route (P-04.4). Server-rendered composition of the section components. */
export function FeatureUnitDetailRoute({
  projectKey,
  projectName,
  roadmapKey,
  roadmapTitle,
  detail,
}: FeatureUnitDetailRouteProps) {
  const { featureUnit, acceptanceCriteria, dependencies, componentWork, componentContracts, humanVerification, timeline } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/projects">Projects</Link> / <Link href={`/projects/${projectKey}`}>{projectName}</Link> /{" "}
        <Link href={`/projects/${projectKey}/roadmaps`}>Roadmaps</Link> /{" "}
        <Link href={`/projects/${projectKey}/roadmaps/${roadmapKey}`}>{roadmapTitle}</Link> / {featureUnit.title}
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.sequence}>#{featureUnit.sequenceNumber}</span>
          <h1 className={styles.title}>{featureUnit.title}</h1>
          <StatusBadge tone={LIFECYCLE_STATE_TONE[featureUnit.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[featureUnit.state] ?? featureUnit.state} />
        </div>
        <p className={styles.intent}>{featureUnit.intent}</p>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>featureUnitKey</span>
            <MachineValue value={featureUnit.featureUnitKey} label="featureUnitKey" />
          </span>
          <span>
            <span className={styles.metaLabel}>위험도</span>
            {RISK_LEVEL_LABEL[featureUnit.riskLevel]}
          </span>
          <span>
            <span className={styles.metaLabel}>제약 프로필</span>v{featureUnit.constraintProfile.version}
          </span>
          <span>
            <span className={styles.metaLabel}>Spec</span>rev.{featureUnit.spec.revision}
            {featureUnit.spec.href ? <Link href={featureUnit.spec.href}> 보기</Link> : null}
          </span>
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <FeatureUnitGateBand detail={detail} />

      <div className={styles.topGrid}>
        <Panel title="범위 및 인수 기준" headingId="acceptance-criteria-heading">
          {acceptanceCriteria.items.length === 0 ? (
            <EmptyState title="등록된 인수 기준이 없습니다." />
          ) : (
            <>
              <div className="ado-show-desktop-table">
                <AcceptanceCriteriaTable
                  items={acceptanceCriteria.items}
                  captionText={`인수 기준, ${acceptanceCriteria.items.length}건 중 필수 ${acceptanceCriteria.requiredCount}건`}
                />
              </div>
              <div className="ado-show-mobile-cards">
                <AcceptanceCriteriaCards items={acceptanceCriteria.items} />
              </div>
            </>
          )}
        </Panel>
        <FeatureDependencyLists dependencies={dependencies} />
      </div>

      <div className={styles.section}>
        <ComponentWorkMatrix componentWork={componentWork} />
      </div>

      <div className={styles.bottomGrid}>
        <ComponentContractList contracts={componentContracts} />
        <HumanVerificationSummary humanVerification={humanVerification} />
      </div>

      <div className={styles.section}>
        <FeatureUnitTimeline timeline={timeline} />
      </div>
    </div>
  );
}
