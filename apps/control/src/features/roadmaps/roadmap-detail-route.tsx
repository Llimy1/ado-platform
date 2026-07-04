import Link from "next/link";
import styles from "./roadmap-detail-route.module.css";
import { RoadmapPlanningGate } from "./roadmap-planning-gate";
import { FeatureUnitDecompositionTable } from "./feature-unit-decomposition-table";
import { FeatureUnitDecompositionCards } from "./feature-unit-decomposition-cards";
import { RecentPlanningActivity } from "./recent-planning-activity";
import { DependencyFigure } from "@/components/dependency/DependencyFigure";
import { DependencyList } from "@/components/dependency/DependencyList";
import { Panel } from "@/components/Panel";
import { MachineValue } from "@/components/MachineValue";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { formatAbsoluteTime, ROADMAP_STATE_LABEL, ROADMAP_STATE_TONE } from "@/lib/format";
import type { RoadmapDetailResponse } from "@/lib/contracts/roadmaps";

interface RoadmapDetailRouteProps {
  projectKey: string;
  projectName: string;
  detail: RoadmapDetailResponse;
}

/** P-03 Roadmap detail route (P-03.4). Server-rendered composition of the section components. */
export function RoadmapDetailRoute({ projectKey, projectName, detail }: RoadmapDetailRouteProps) {
  const { roadmap, featureUnits, dependencyMap, recentPlanningActivity } = detail;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/projects">Projects</Link> / <Link href={`/projects/${projectKey}`}>{projectName}</Link> /{" "}
        <Link href={`/projects/${projectKey}/roadmaps`}>Roadmaps</Link> / {roadmap.title}
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{roadmap.title}</h1>
          <StatusBadge tone={ROADMAP_STATE_TONE[roadmap.state]} label={ROADMAP_STATE_LABEL[roadmap.state]} />
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>roadmapKey</span>
            <MachineValue value={roadmap.roadmapKey} label="roadmapKey" />
          </span>
          <span>
            <span className={styles.metaLabel}>소스 버전</span>
            <span className="ado-mono">{roadmap.source.sourceVersion}</span>
          </span>
          <span>
            <span className={styles.metaLabel}>content SHA</span>
            <MachineValue value={roadmap.source.contentSha256} label="content SHA" />
          </span>
          {roadmap.analyzedAt ? (
            <span>
              <span className={styles.metaLabel}>분석 시각</span>
              {formatAbsoluteTime(roadmap.analyzedAt)}
            </span>
          ) : null}
          {roadmap.approvedAt ? (
            <span>
              <span className={styles.metaLabel}>승인 시각</span>
              {formatAbsoluteTime(roadmap.approvedAt)}
            </span>
          ) : null}
          {roadmap.source.renderedDocumentHref ? (
            <Link href={roadmap.source.renderedDocumentHref}>소스 문서 보기</Link>
          ) : (
            <span className={styles.muted}>소스 문서 사용 불가</span>
          )}
          <span>마지막 확인: {formatAbsoluteTime(detail.snapshot.observedAt)}</span>
        </div>
      </div>

      <RoadmapPlanningGate detail={detail} />

      <div className={styles.section}>
        <Panel title="Feature Unit 분해" headingId="feature-unit-decomposition-heading">
          {featureUnits.items.length === 0 ? (
            <EmptyState title="분해된 Feature Unit이 없습니다." />
          ) : (
            <>
              <div className="ado-show-desktop-table">
                <FeatureUnitDecompositionTable
                  items={featureUnits.items}
                  captionText={`Feature Unit 분해, ${featureUnits.items.length}건 표시 중`}
                />
              </div>
              <div className="ado-show-mobile-cards">
                <FeatureUnitDecompositionCards items={featureUnits.items} />
              </div>
            </>
          )}
          {featureUnits.omittedCount > 0 ? (
            <p className={styles.footerLink}>
              그 외 {featureUnits.omittedCount}건 더 있음 (전체 {featureUnits.totalCount}건 중)
            </p>
          ) : null}
        </Panel>
      </div>

      <div className={styles.bottomGrid}>
        <RecentPlanningActivity activity={recentPlanningActivity} />
        <Panel title="의존성" headingId="roadmap-dependency-heading">
          <DependencyFigure dependencyMap={dependencyMap} listAnchorId="roadmap-dependency-list" />
          <DependencyList dependencyMap={dependencyMap} anchorId="roadmap-dependency-list" />
        </Panel>
      </div>
    </div>
  );
}
