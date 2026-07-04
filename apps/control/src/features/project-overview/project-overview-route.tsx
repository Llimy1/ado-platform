"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./project-overview-route.module.css";
import { ProjectAttentionBand } from "./project-attention-band";
import { FocusFeatureUnitCard } from "./focus-feature-unit-card";
import { PendingDecisionList } from "./pending-decision-list";
import { ComponentWorkSummaryTable } from "./component-work-summary-table";
import { ExecutionFocusPanel } from "./execution-focus-panel";
import { RecentActivityTimeline } from "./recent-activity-timeline";
import { DependencyFigure } from "@/components/dependency/DependencyFigure";
import { DependencyList } from "@/components/dependency/DependencyList";
import { Button } from "@/components/Button";
import { MachineValue } from "@/components/MachineValue";
import { IconRefresh } from "@/components/icons";
import { DeniedState, ErrorState, StaleBanner } from "@/components/StateViews";
import { formatAbsoluteTime, OPERATIONAL_STATUS_LABEL } from "@/lib/format";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

type Phase = "ready" | "error_with_snapshot" | "error_without_snapshot" | "denied";

interface ProjectOverviewRouteProps {
  projectKey: string;
  initialOverview: ProjectOverviewResponse | null;
  initialStatus: 404 | 200;
}

/**
 * No SSE subscription: real-time freshness is out of scope for this
 * prototype (see completion report). The header's manual 새로고침 button is
 * the only way to pull a fresh REST snapshot, which stays consistent with
 * "REST snapshots are authoritative" even without a live-update hint.
 */
export function ProjectOverviewRoute({ projectKey, initialOverview, initialStatus }: ProjectOverviewRouteProps) {
  const [overview, setOverview] = useState<ProjectOverviewResponse | null>(initialOverview);
  const [phase, setPhase] = useState<Phase>(initialStatus === 404 ? "denied" : "ready");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [projectKey]);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(`/api/mock/projects/${projectKey}/overview`, { cache: "no-store" });
      if (res.status === 404) {
        setPhase("denied");
        setOverview(null);
        return;
      }
      if (!res.ok) {
        setPhase(overview ? "error_with_snapshot" : "error_without_snapshot");
        return;
      }
      const body = (await res.json()) as ProjectOverviewResponse;
      setOverview(body);
      setPhase("ready");
    } catch {
      setPhase(overview ? "error_with_snapshot" : "error_without_snapshot");
    }
  }, [projectKey, overview]);

  if (phase === "denied") {
    return <DeniedState title="이 Project를 볼 수 있는 권한이 없거나 존재하지 않습니다." backHref="/projects" />;
  }

  if (!overview) {
    return (
      <ErrorState
        title="Project Overview를 불러오지 못했습니다."
        requestId="unknown"
        onRetry={refetch}
      />
    );
  }

  const { project, attention, roadmap } = overview;

  return (
    <div>
      <p className={styles.breadcrumb}>
        <Link href="/projects">Projects</Link> / {project.name}
      </p>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title} tabIndex={-1} ref={headingRef}>
            {project.name}
          </h1>
          {project.archived ? <span className={styles.archivedTag}>보관됨</span> : null}
        </div>
        <div className={styles.metaRow}>
          <span>
            <span className={styles.metaLabel}>projectKey</span>
            <MachineValue value={project.projectKey} label="projectKey" />
          </span>
          {project.repository ? (
            <>
              <span>
                <span className={styles.metaLabel}>저장소</span>
                <span className="ado-mono">{project.repository.remoteUrlRedacted}</span>
              </span>
              <span>
                <span className={styles.metaLabel}>integration branch</span>
                <span className="ado-mono">{project.repository.integrationBranch}</span>
              </span>
            </>
          ) : null}
          {project.activeConstraintProfile ? (
            <span>
              <span className={styles.metaLabel}>제약 프로필</span>v{project.activeConstraintProfile.version}
            </span>
          ) : null}
          <span>
            <span className={styles.metaLabel}>운영 상태</span>
            {OPERATIONAL_STATUS_LABEL[attention.operationalStatus]}
          </span>
          <span>
            마지막 확인: {formatAbsoluteTime(overview.snapshot.observedAt)}{" "}
            <Button variant="ghost" dense onClick={refetch} aria-label="새로고침">
              <IconRefresh />
              새로고침
            </Button>
          </span>
        </div>
      </div>

      {phase === "error_with_snapshot" ? (
        <StaleBanner observedAtLabel={formatAbsoluteTime(overview.snapshot.observedAt)} onRetry={refetch} />
      ) : null}

      <ProjectAttentionBand attention={attention} />

      <div className={styles.grid}>
        <div className={styles.areaFocus}>
          <FocusFeatureUnitCard
            focusFeatureUnit={overview.focusFeatureUnit}
            emptyReason={overview.focusFeatureUnitEmptyReason}
            roadmapHref={roadmap?.href}
          />
        </div>
        <div className={styles.areaDecisions}>
          <PendingDecisionList decisionQueue={overview.decisionQueue} />
        </div>
        <div className={styles.areaWork}>
          <ComponentWorkSummaryTable componentWork={overview.componentWork} />
        </div>
        <div className={styles.areaExecution}>
          <ExecutionFocusPanel executionFocus={overview.executionFocus} />
        </div>
        <div className={styles.areaActivity}>
          <RecentActivityTimeline recentActivity={overview.recentActivity} />
        </div>
        <div className={styles.areaDependency}>
          <DependencyFigure dependencyMap={overview.dependencyMap} />
          <DependencyList dependencyMap={overview.dependencyMap} />
        </div>
      </div>
    </div>
  );
}
