/**
 * Mirrors GET /v1/projects/{projectKey}/overview from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-02.2. Hand-maintained UI-prototype types;
 * see note in ./projects.ts.
 */
import type { AttentionSeverity, ProjectAttentionReason } from "./projects";
import type { DependencyMap } from "./dependency-graph";

export interface ProjectOverviewResponse {
  project: {
    projectKey: string;
    name: string;
    description: string | null;
    archived: boolean;
    timezone: string;
    repository: {
      repositoryKey: string;
      remoteUrlRedacted: string;
      integrationBranch: string;
      defaultBranch: string;
    } | null;
    activeConstraintProfile: { version: number; approvedAt: string } | null;
  };
  attention: {
    severity: AttentionSeverity;
    operationalStatus:
      | "healthy"
      | "attention_required"
      | "blocked"
      | "incident_hold"
      | "archived";
    reasons: Array<{ code: ProjectAttentionReason; count: number; href: string }>;
    nextRequiredHumanAction: {
      decisionKey: string;
      title: string;
      dueAt: string | null;
      href: string;
    } | null;
  };
  roadmap: {
    roadmapKey: string;
    title: string;
    state: string;
    requiredFeatureUnit: {
      total: number;
      closed: number;
      active: number;
      blocked: number;
      awaitingHuman: number;
    };
    href: string;
  } | null;
  focusFeatureUnit: {
    featureUnitKey: string;
    title: string;
    state: string;
    reason: "requires_human_action" | "blocked" | "active" | "next_approved";
    componentWork: {
      total: number;
      running: number;
      blocked: number;
      needsRevision: number;
      readyForPr: number;
      prCreated: number;
    };
    href: string;
  } | null;
  focusFeatureUnitEmptyReason:
    | "no_approved_roadmap"
    | "no_feature_units"
    | "all_required_feature_units_closed"
    | "project_archived"
    | null;
  componentWork: {
    items: Array<{
      componentWorkKey: string;
      title: string;
      primaryComponent: { key: string; displayName: string };
      executionScope: "single" | "coordinated";
      state: string;
      attentionSeverity: AttentionSeverity;
      activeRun: { jobAttemptId: string; startedAt: string; href: string } | null;
      lastCommittedEventAt: string;
      href: string;
    }>;
    totalOpenCount: number;
    omittedCount: number;
  };
  executionFocus: {
    activeAttemptCount: number;
    primary: {
      jobKey: string;
      jobAttemptId: string;
      agentRunId: string | null;
      componentWorkKey: string;
      phase: string;
      runnerLabel: string;
      startedAt: string;
      timeoutAt: string;
      href: string;
    } | null;
    capacity: {
      eligibleReadyWorkerCount: number;
      eligibleDegradedWorkerCount: number;
      queueDepthForProject: number;
      oldestQueuedAt: string | null;
    };
  };
  decisionQueue: {
    items: Array<{
      decisionKey: string;
      title: string;
      targetType: "feature_unit" | "component_work" | "incident" | "configuration";
      requestedAt: string;
      dueAt: string | null;
      severity: AttentionSeverity;
      href: string;
    }>;
    totalPendingCount: number;
    omittedCount: number;
  };
  recentActivity: {
    items: Array<{
      eventKey: string;
      occurredAt: string;
      actorLabel: string;
      kind:
        | "state_transition"
        | "verification"
        | "review"
        | "decision"
        | "incident"
        | "pull_request";
      summary: string;
      subject: { type: string; key: string; href: string };
      evidenceHref: string | null;
    }>;
    omittedCount: number;
  };
  dependencyMap: DependencyMap;
  snapshot: {
    observedAt: string;
    resourceVersion: string;
    requestId: string;
  };
}
