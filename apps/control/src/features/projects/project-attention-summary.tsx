import styles from "./project-attention-summary.module.css";
import type { ProjectListResponse } from "@/lib/contracts/projects";

/**
 * Non-clickable readout of the currently filtered result, per P-01.5. This
 * describes only the filtered result, never an undisclosed global count.
 */
export function ProjectAttentionSummary({ summary }: { summary: ProjectListResponse["summary"] }) {
  return (
    <div className={styles.summary}>
      <div className={styles.cell}>
        <div className={styles.count}>{summary.actionRequiredCount}</div>
        <div className={styles.label}>사람 판단 필요</div>
      </div>
      <div className={styles.cell}>
        <div className={styles.count}>{summary.blockedCount}</div>
        <div className={styles.label}>차단됨</div>
      </div>
      <div className={styles.cell}>
        <div className={styles.count}>{summary.incidentHoldCount}</div>
        <div className={styles.label}>사고 보류</div>
      </div>
    </div>
  );
}
