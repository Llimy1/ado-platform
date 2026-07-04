import Link from "next/link";
import styles from "./project-list-cards.module.css";
import { StatusBadge } from "@/components/StatusBadge";
import { formatRelativeTime, formatAbsoluteTime, ATTENTION_REASON_LABEL, OPERATIONAL_STATUS_LABEL, OPERATIONAL_STATUS_TONE } from "@/lib/format";
import type { ProjectListItem } from "@/lib/contracts/projects";

/** Card list for tablet/mobile (P-01.6). Same data, no table semantics. */
export function ProjectListCards({ items }: { items: ProjectListItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const tone = OPERATIONAL_STATUS_TONE[item.operationalStatus];
        const topReason = item.attention.reasons[0];
        return (
          <li key={item.projectKey} className={styles.card}>
            <div className={styles.cardHeader}>
              <Link href={item.links.overview} className={styles.name}>
                {item.name}
              </Link>
              <StatusBadge tone={tone} label={OPERATIONAL_STATUS_LABEL[item.operationalStatus]} />
            </div>
            <div className={styles.metaRow}>
              <div>
                <span className={styles.metaLabel}>활성 Feature Unit</span>
                {item.activeFeatureUnit ? item.activeFeatureUnit.title : "활성 작업 없음"}
              </div>
              <div>
                <span className={styles.metaLabel}>주의</span>
                {topReason ? ATTENTION_REASON_LABEL[topReason] : "없음"}
              </div>
            </div>
            <div className={styles.footer}>
              <time
                dateTime={item.lastCommittedEventAt}
                title={formatAbsoluteTime(item.lastCommittedEventAt)}
                tabIndex={0}
                style={{ fontSize: "var(--ado-text-dense-size)", color: "var(--ado-color-text-tertiary)" }}
              >
                {formatRelativeTime(item.lastCommittedEventAt)}
              </time>
              <Link href={item.links.overview}>Project 열기</Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
