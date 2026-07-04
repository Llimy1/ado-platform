import Link from "next/link";
import styles from "./roadmap-filter-form.module.css";
import buttonStyles from "@/components/Button.module.css";
import { ROADMAP_STATE_LABEL } from "@/lib/format";
import type { RoadmapSort, RoadmapState } from "@/lib/contracts/roadmaps";

const STATE_OPTIONS: RoadmapState[] = [
  "draft",
  "analyzed",
  "review_ready",
  "approved",
  "active",
  "completed",
  "blocked",
  "incident_hold",
  "cancelled",
  "archived",
];

const SORT_OPTIONS: Array<{ value: RoadmapSort; label: string }> = [
  { value: "activity", label: "최근 활동 순" },
  { value: "sequence", label: "roadmapKey 순" },
  { value: "name", label: "이름순" },
];

/**
 * Plain GET form: filter/sort changes navigate to a new URL, which
 * re-executes this Server Component with fresh mock data. No client JS,
 * no fetch, no API route.
 */
export function RoadmapFilterForm({
  projectKey,
  state,
  sort,
  isFiltered,
}: {
  projectKey: string;
  state?: RoadmapState;
  sort: RoadmapSort;
  isFiltered: boolean;
}) {
  return (
    <form className={styles.form} method="get">
      <div className={styles.field}>
        <label className={styles.label} htmlFor="roadmap-state">
          상태
        </label>
        <select id="roadmap-state" name="state" defaultValue={state ?? ""} className={styles.select}>
          <option value="">전체</option>
          {STATE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {ROADMAP_STATE_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="roadmap-sort">
          정렬
        </label>
        <select id="roadmap-sort" name="sort" defaultValue={sort} className={styles.select}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className={[buttonStyles.button, buttonStyles.secondary, buttonStyles.sizeDense].join(" ")}>
        적용
      </button>
      {isFiltered ? (
        <Link
          href={`/projects/${projectKey}/roadmaps`}
          className={[buttonStyles.button, buttonStyles.ghost, buttonStyles.sizeDense].join(" ")}
        >
          필터 초기화
        </Link>
      ) : null}
    </form>
  );
}
