import Link from "next/link";
import styles from "./review-group-detail.module.css";
import { ReviewerCoverage } from "./reviewer-coverage";
import { ArbiterDecisionPanel } from "./arbiter-decision-panel";
import { ReviewFindingsTable } from "./review-findings-table";
import { RevisionTaskList } from "./revision-task-list";
import { MachineValue } from "@/components/MachineValue";
import { formatAbsoluteTime } from "@/lib/format";
import type { ReviewGroupDetailResponse } from "@/lib/contracts/review-group";

/**
 * P-07.4 Review Group route: group identity, reviewer coverage, Arbiter
 * panel, findings, RevisionTasks. Read-only — cannot edit a reviewer
 * result or create a PR from here.
 */
export function ReviewGroupDetail({ detail }: { detail: ReviewGroupDetailResponse }) {
  const { reviewGroup, reviewers, findings, arbiterDecision, revisionTasks } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href={reviewGroup.componentWorkHref}>Component Work로 돌아가기</Link>
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>리뷰: {reviewGroup.componentWorkTitle}</h1>
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>reviewGroupId</span>
            <MachineValue value={reviewGroup.reviewGroupId} label="reviewGroupId" />
          </span>
          <span>
            <span className={styles.metaLabel}>리뷰 패킷 SHA</span>
            <MachineValue value={reviewGroup.reviewPacket.contentSha256} label="리뷰 패킷 SHA" />
          </span>
          <span>
            <span className={styles.metaLabel}>그룹 상태</span>
            {reviewGroup.state}
          </span>
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <ReviewerCoverage reviewGroup={reviewGroup} reviewers={reviewers} />
      </div>

      <div className={styles.section}>
        <ArbiterDecisionPanel decision={arbiterDecision} />
      </div>

      <div className={styles.section}>
        <ReviewFindingsTable findings={findings} />
      </div>

      <div className={styles.section}>
        <RevisionTaskList tasks={revisionTasks} />
      </div>
    </div>
  );
}
