import Link from "next/link";
import styles from "./project-attention-band.module.css";
import buttonStyles from "@/components/Button.module.css";
import { ATTENTION_REASON_LABEL, ATTENTION_SEVERITY_LABEL } from "@/lib/format";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

/**
 * Absent for healthy Projects. For warning/critical it appears before all
 * summaries (P-02.4). Not dismissible until the REST projection changes.
 */
export function ProjectAttentionBand({ attention }: { attention: ProjectOverviewResponse["attention"] }) {
  if (attention.severity === "none") return null;
  const tone = attention.severity === "critical" ? styles.critical : styles.warning;

  return (
    <div className={[styles.band, tone].join(" ")} role="alert" tabIndex={-1}>
      <div className={styles.text}>
        <span className={styles.severityLabel}>{ATTENTION_SEVERITY_LABEL[attention.severity]}</span>
        <div className={styles.reasonList}>
          {attention.reasons.map((r) => (
            <Link key={r.code} href={r.href}>
              {ATTENTION_REASON_LABEL[r.code]} ({r.count})
            </Link>
          ))}
        </div>
      </div>
      {attention.nextRequiredHumanAction ? (
        <Link
          href={attention.nextRequiredHumanAction.href}
          className={[buttonStyles.button, buttonStyles.primary, buttonStyles.sizeDense].join(" ")}
        >
          {attention.nextRequiredHumanAction.title}
        </Link>
      ) : null}
    </div>
  );
}
