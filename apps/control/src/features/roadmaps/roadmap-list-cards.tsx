import Link from "next/link";
import styles from "./roadmap-list-cards.module.css";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAbsoluteTime, formatRelativeTime, ROADMAP_STATE_LABEL, ROADMAP_STATE_TONE } from "@/lib/format";
import type { RoadmapListItem } from "@/lib/contracts/roadmaps";

/** Card list for tablet/mobile (below 1024px), same data as the table. */
export function RoadmapListCards({ items }: { items: RoadmapListItem[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.roadmapKey} className={styles.card}>
          <div className={styles.cardHeader}>
            <Link href={item.href} className={styles.name}>
              {item.title}
            </Link>
            <StatusBadge tone={ROADMAP_STATE_TONE[item.state]} label={ROADMAP_STATE_LABEL[item.state]} />
          </div>
          <div className={styles.metaRow}>
            <div>
              <span className={styles.metaLabel}>Feature Unit</span>총 {item.featureUnitSummary.total}건
            </div>
            <div>
              <span className={styles.metaLabel}>계획 결정</span>
              {item.pendingPlanningDecision ? "대기 중" : "없음"}
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
            <Link href={item.href}>Roadmap 열기</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
