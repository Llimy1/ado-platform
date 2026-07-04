import Link from "next/link";
import styles from "./roadmap-list-table.module.css";
import { StatusBadge } from "@/components/StatusBadge";
import { MachineValue } from "@/components/MachineValue";
import { IconOpen } from "@/components/icons";
import { formatAbsoluteTime, formatRelativeTime, ROADMAP_STATE_LABEL, ROADMAP_STATE_TONE } from "@/lib/format";
import type { RoadmapListItem } from "@/lib/contracts/roadmaps";

/** Semantic table for the Roadmap index (P-03.1). Native table only, no ARIA grid. */
export function RoadmapListTable({ items, captionText }: { items: RoadmapListItem[]; captionText: string }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>{captionText}</caption>
        <thead>
          <tr>
            <th scope="col">Roadmap</th>
            <th scope="col">상태</th>
            <th scope="col">Feature Unit 현황</th>
            <th scope="col">계획 결정</th>
            <th scope="col">최근 활동</th>
            <th scope="col">
              <span className="ado-visually-hidden">열기</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.roadmapKey}>
              <td>
                <Link href={item.href} className={styles.roadmapTitle}>
                  {item.title}
                </Link>
                <MachineValue value={item.roadmapKey} label="roadmapKey" />
              </td>
              <td>
                <StatusBadge tone={ROADMAP_STATE_TONE[item.state]} label={ROADMAP_STATE_LABEL[item.state]} />
              </td>
              <td>
                총 {item.featureUnitSummary.total}건 · 실행 {item.featureUnitSummary.active} · 차단{" "}
                {item.featureUnitSummary.blocked} · 완료 {item.featureUnitSummary.closed}
              </td>
              <td>
                {item.pendingPlanningDecision ? (
                  <StatusBadge tone="warning" label="결정 대기" />
                ) : (
                  <span className={styles.muted}>없음</span>
                )}
              </td>
              <td>
                <time
                  dateTime={item.lastCommittedEventAt}
                  title={formatAbsoluteTime(item.lastCommittedEventAt)}
                  tabIndex={0}
                >
                  {formatRelativeTime(item.lastCommittedEventAt)}
                </time>
              </td>
              <td>
                <Link href={item.href} className={styles.openLink} aria-label={`${item.title} 열기`}>
                  <IconOpen />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
