import Link from "next/link";
import styles from "./reviewer-coverage.module.css";
import { Panel } from "@/components/Panel";
import { formatAbsoluteTime } from "@/lib/format";
import type { ReviewGroupDetailResponse } from "@/lib/contracts/review-group";

/** P-07.3/P-07.4: reviewer coverage — never exposes private reasoning or unredacted raw output. */
export function ReviewerCoverage({ reviewGroup, reviewers }: { reviewGroup: ReviewGroupDetailResponse["reviewGroup"]; reviewers: ReviewGroupDetailResponse["reviewers"] }) {
  return (
    <Panel title="리뷰어 커버리지" headingId="reviewer-coverage-heading">
      <p style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-secondary)", marginBottom: "var(--ado-space-3)" }}>
        위험도 {reviewGroup.riskLevel} · 필요 리뷰어 {reviewGroup.requiredReviewerCount}명 · 완료된 리뷰어 {reviewers.length}명
      </p>
      <ul className={styles.list}>
        {reviewers.map((r) => (
          <li key={r.reviewerKey} className={styles.row}>
            <span className="ado-mono">
              {r.provider} / {r.modelIdentifier}
            </span>
            <span>{r.status}</span>
            <span>{r.completedAt ? formatAbsoluteTime(r.completedAt) : <span className={styles.muted}>미완료</span>}</span>
            {r.resultArtifactHref ? <Link href={r.resultArtifactHref}>결과 보기</Link> : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
