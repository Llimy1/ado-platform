/**
 * Mirrors GET /v1/projects/{projectKey}/roadmaps and
 * .../roadmaps/{roadmapKey} from ADO/CONTROL_ROOM_PAGE_SPECS.md P-03.2/P-03.3.
 * Hand-maintained UI-prototype types; see note in ./projects.ts.
 */
import type { DependencyMap } from "./dependency-graph";

export type RoadmapState =
  | "draft"
  | "analyzed"
  | "review_ready"
  | "approved"
  | "active"
  | "completed"
  | "archived"
  | "blocked"
  | "cancelled"
  | "incident_hold";

export type RoadmapSort = "activity" | "sequence" | "name";

export interface RoadmapListQuery {
  state?: RoadmapState;
  sort?: RoadmapSort;
  cursor?: string;
  limit?: number;
}

export interface RoadmapListItem {
  roadmapKey: string;
  title: string;
  state: RoadmapState;
  source: { version: string; importedAt: string; contentSha256: string };
  featureUnitSummary: {
    total: number;
    approved: number;
    active: number;
    blocked: number;
    closed: number;
  };
  pendingPlanningDecision: boolean;
  lastCommittedEventAt: string;
  href: string;
}

export interface RoadmapListResponse {
  items: RoadmapListItem[];
  page: { limit: number; nextCursor: string | null; hasMore: boolean };
  snapshot: { observedAt: string; requestId: string };
}

export type PlanningGateState =
  | "not_ready"
  | "analysis_required"
  | "human_decision_required"
  | "approved"
  | "blocked";

export interface RoadmapDetailResponse {
  roadmap: {
    roadmapKey: string;
    title: string;
    summary: string;
    state: RoadmapState;
    source: {
      artifactKey: string;
      sourceKind: string;
      sourceVersion: string;
      contentSha256: string;
      importedAt: string;
      renderedDocumentHref: string | null;
    };
    analyzedAt: string | null;
    approvedAt: string | null;
    resourceVersion: string;
  };
  planningGate: {
    state: PlanningGateState;
    explanationCode: string;
    allowedActions: Array<"record_human_decision">;
    decisionRequirements: {
      canApprove: boolean;
      canRequestChanges: boolean;
      changeRequestReasonRequired: boolean;
      expectedResourceVersion: string;
    };
  };
  featureUnits: {
    items: Array<{
      featureUnitKey: string;
      sequenceNumber: number;
      title: string;
      state: string;
      riskLevel: string;
      dependency: {
        requiredPrerequisiteCount: number;
        unsatisfiedPrerequisiteCount: number;
        blockingDependentCount: number;
      };
      componentWork: {
        requiredCount: number;
        openCount: number;
        blockedCount: number;
        prCreatedCount: number;
      };
      pendingHumanDecisionCount: number;
      href: string;
    }>;
    totalCount: number;
    omittedCount: number;
  };
  dependencyMap: DependencyMap;
  recentPlanningActivity: {
    items: Array<{
      eventKey: string;
      occurredAt: string;
      actorLabel: string;
      summary: string;
      evidenceHref: string | null;
    }>;
    omittedCount: number;
  };
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}

/** POST .../roadmaps/{roadmapKey}/commands/record-human-decision request body. Not wired to any backend in this prototype. */
export interface RecordRoadmapPlanningDecisionRequest {
  decision: "approved" | "changes_requested";
  expectedResourceVersion: string;
  reason?: string;
}
