import Link from "next/link";
import styles from "./component-work-scope-panel.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

/** P-05.4: local council/arbiter state plus accepted P0/P1 and unresolved counts. */
export function ReviewSummaryPanel({ review }: { review: ComponentWorkDetailResponse["review"] }) {
  return (
    <Panel title="리뷰" headingId="review-summary-heading">
      <div style={{ marginBottom: "var(--ado-space-3)" }}>
        <StatusBadge tone={LIFECYCLE_STATE_TONE[review.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[review.state] ?? review.state} />
      </div>
      <dl className={styles.kvGrid}>
        <div>
          <span className={styles.kvLabel}>승인된 P0/P1 지적</span>
          {review.acceptedP0P1FindingCount}건
        </div>
        <div>
          <span className={styles.kvLabel}>미해결 지적</span>
          {review.unresolvedFindingCount}건
        </div>
      </dl>
      {review.href ? (
        <Link href={review.href} style={{ display: "block", marginTop: "var(--ado-space-3)" }}>
          리뷰 상세 보기
        </Link>
      ) : null}
    </Panel>
  );
}
