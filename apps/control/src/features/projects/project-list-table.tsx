import Link from "next/link";
import styles from "./project-list-table.module.css";
import { StatusBadge } from "@/components/StatusBadge";
import { MachineValue } from "@/components/MachineValue";
import { IconOpen, IconChevronUp, IconChevronDown, IconChevronsUpDown } from "@/components/icons";
import { formatAbsoluteTime, formatRelativeTime, ATTENTION_REASON_LABEL, OPERATIONAL_STATUS_LABEL, OPERATIONAL_STATUS_TONE } from "@/lib/format";
import type { ProjectListItem, ProjectSort, SortDirection } from "@/lib/contracts/projects";

interface ProjectListTableProps {
  items: ProjectListItem[];
  sort: ProjectSort;
  direction: SortDirection;
  onSortHeaderClick: (sort: ProjectSort) => void;
  captionText: string;
}

function SortHeader({
  label,
  sortKey,
  currentSort,
  direction,
  onClick,
}: {
  label: string;
  sortKey: ProjectSort;
  currentSort: ProjectSort;
  direction: SortDirection;
  onClick: (sort: ProjectSort) => void;
}) {
  const active = currentSort === sortKey;
  return (
    <th scope="col" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" className={styles.sortButton} onClick={() => onClick(sortKey)}>
        {label}
        {active ? (
          direction === "asc" ? (
            <IconChevronUp className={styles.sortIconActive} />
          ) : (
            <IconChevronDown className={styles.sortIconActive} />
          )
        ) : (
          <IconChevronsUpDown className={styles.sortIconInactive} />
        )}
      </button>
    </th>
  );
}

/** Full semantic table for Projects (P-01.5). Native table semantics only; no ARIA grid. */
export function ProjectListTable({
  items,
  sort,
  direction,
  onSortHeaderClick,
  captionText,
}: ProjectListTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>{captionText}</caption>
        <thead>
          <tr>
            <SortHeader label="Project" sortKey="name" currentSort={sort} direction={direction} onClick={onSortHeaderClick} />
            <SortHeader label="운영 상태" sortKey="attention" currentSort={sort} direction={direction} onClick={onSortHeaderClick} />
            <th scope="col" className={styles.colFeatureUnit}>
              활성 Feature Unit
            </th>
            <th scope="col" className={styles.colWork}>
              Component Work
            </th>
            <th scope="col" className={styles.colAttention}>
              주의
            </th>
            <SortHeader label="최근 활동" sortKey="activity" currentSort={sort} direction={direction} onClick={onSortHeaderClick} />
            <th scope="col" className={styles.colOpen}>
              <span className="ado-visually-hidden">열기</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const tone = OPERATIONAL_STATUS_TONE[item.operationalStatus];
            const topReason = item.attention.reasons[0];
            const remaining = item.attention.reasons.length - 1;
            return (
              <tr key={item.projectKey}>
                <td className={styles.colProject}>
                  <Link href={item.links.overview} className={styles.projectName}>
                    {item.name}
                  </Link>
                  <MachineValue value={item.projectKey} label="projectKey" />
                  {item.description ? (
                    <span className={styles.projectDescription} title={item.description}>
                      {item.description}
                    </span>
                  ) : null}
                </td>
                <td className={styles.colStatus}>
                  <StatusBadge tone={tone} label={OPERATIONAL_STATUS_LABEL[item.operationalStatus]} />
                </td>
                <td className={styles.colFeatureUnit}>
                  {item.activeFeatureUnit ? (
                    <Link href={item.links.activeFeatureUnit ?? item.links.overview}>
                      {item.activeFeatureUnit.title}
                    </Link>
                  ) : (
                    <span className={styles.muted}>활성 작업 없음</span>
                  )}
                </td>
                <td className={styles.colWork}>
                  {item.componentWork.activeCount} 진행 / {item.componentWork.openCount} 열림
                </td>
                <td className={styles.colAttention}>
                  {topReason ? (
                    <span>
                      {ATTENTION_REASON_LABEL[topReason]}
                      {remaining > 0 ? ` 외 ${remaining}건` : ""}
                    </span>
                  ) : (
                    <span className={styles.muted}>없음</span>
                  )}
                </td>
                <td className={styles.colActivity}>
                  <time dateTime={item.lastCommittedEventAt} title={formatAbsoluteTime(item.lastCommittedEventAt)} tabIndex={0}>
                    {formatRelativeTime(item.lastCommittedEventAt)}
                  </time>
                </td>
                <td className={styles.colOpen}>
                  <Link href={item.links.overview} className={styles.openLink} aria-label={`${item.name} 열기`}>
                    <IconOpen />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
