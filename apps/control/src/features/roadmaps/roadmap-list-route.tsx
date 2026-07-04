import Link from "next/link";
import styles from "./roadmap-list-route.module.css";
import { RoadmapFilterForm } from "./roadmap-filter-form";
import { RoadmapListTable } from "./roadmap-list-table";
import { RoadmapListCards } from "./roadmap-list-cards";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import type { RoadmapListResponse, RoadmapSort, RoadmapState } from "@/lib/contracts/roadmaps";

interface RoadmapListRouteProps {
  projectKey: string;
  projectName: string;
  response: RoadmapListResponse;
  state?: RoadmapState;
  sort: RoadmapSort;
}

/** P-03 Roadmap index (P-03.1). Server-rendered; filter/sort navigate via a GET form. */
export function RoadmapListRoute({ projectKey, projectName, response, state, sort }: RoadmapListRouteProps) {
  const isFiltered = Boolean(state);

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/projects">Projects</Link> / <Link href={`/projects/${projectKey}`}>{projectName}</Link> / Roadmaps
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Roadmaps</h1>
          <span className={styles.resultCount}>{response.items.length}건</span>
        </div>
        <span className={styles.snapshotTime}>마지막 확인: {formatAbsoluteTime(response.snapshot.observedAt)}</span>
      </div>

      <RoadmapFilterForm projectKey={projectKey} state={state} sort={sort} isFiltered={isFiltered} />

      {response.items.length === 0 ? (
        <EmptyState title={isFiltered ? "조건에 맞는 Roadmap이 없습니다." : "등록된 Roadmap이 없습니다."}>
          {isFiltered ? <Link href={`/projects/${projectKey}/roadmaps`}>필터 초기화</Link> : null}
        </EmptyState>
      ) : (
        <>
          <div className="ado-show-desktop-table">
            <RoadmapListTable
              items={response.items}
              captionText={`Roadmap 목록, ${response.items.length}건 표시 중${isFiltered ? " (필터 적용됨)" : ""}`}
            />
          </div>
          <div className="ado-show-mobile-cards">
            <RoadmapListCards items={response.items} />
          </div>
        </>
      )}
    </div>
  );
}
