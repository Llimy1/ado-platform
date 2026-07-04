import Link from "next/link";
import styles from "./component-work-scope-panel.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

/** P-05.4: verification command counts and latest run link; never claims success from an Agent's self-report. */
export function VerificationSummaryPanel({ verification }: { verification: ComponentWorkDetailResponse["verification"] }) {
  return (
    <Panel title="검증" headingId="verification-summary-heading">
      <div style={{ marginBottom: "var(--ado-space-3)" }}>
        <StatusBadge tone={LIFECYCLE_STATE_TONE[verification.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[verification.state] ?? verification.state} />
      </div>
      <dl className={styles.kvGrid}>
        <div>
          <span className={styles.kvLabel}>필수 명령</span>
          {verification.requiredCommandCount}건
        </div>
        <div>
          <span className={styles.kvLabel}>통과</span>
          {verification.passedCommandCount}건
        </div>
        <div>
          <span className={styles.kvLabel}>실패</span>
          {verification.failedCommandCount}건
        </div>
      </dl>
      {verification.href ? (
        <Link href={verification.href} style={{ display: "block", marginTop: "var(--ado-space-3)" }}>
          최근 검증 실행 보기
        </Link>
      ) : null}
    </Panel>
  );
}
