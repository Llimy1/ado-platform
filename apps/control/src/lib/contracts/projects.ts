/**
 * Mirrors GET /v1/projects from ADO/CONTROL_ROOM_PAGE_SPECS.md P-01.2.
 * This is a UI prototype: no generated OpenAPI client exists yet, so these
 * types are hand-maintained against the page spec until packages/contracts
 * is introduced.
 */

export type ProjectOperationalStatus =
  | "healthy"
  | "attention_required"
  | "blocked"
  | "incident_hold"
  | "archived";

export type ProjectAttentionReason =
  | "human_decision_required"
  | "blocked_feature_unit"
  | "blocked_component_work"
  | "verification_failed"
  | "accepted_review_finding"
  | "open_incident";

export type AttentionSeverity = "none" | "warning" | "critical";

export interface ProjectListItem {
  projectKey: string;
  name: string;
  description: string | null;
  lifecycle: "active" | "archived";
  operationalStatus: ProjectOperationalStatus;
  attention: {
    severity: AttentionSeverity;
    reasons: ProjectAttentionReason[];
    humanDecisionCount: number;
    blockedCount: number;
    failedCount: number;
    incidentCount: number;
  };
  activeFeatureUnit: {
    featureUnitKey: string;
    title: string;
    state: string;
  } | null;
  componentWork: {
    activeCount: number;
    openCount: number;
  };
  lastCommittedEventAt: string;
  resourceVersion: string;
  links: {
    self: string;
    overview: string;
    activeFeatureUnit?: string;
  };
}

export interface ProjectListResponse {
  items: ProjectListItem[];
  page: {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
  summary: {
    scope: "filtered_result";
    totalCount: number;
    actionRequiredCount: number;
    blockedCount: number;
    incidentHoldCount: number;
  };
  snapshot: {
    observedAt: string;
    requestId: string;
  };
}

export type ProjectAttentionFilter =
  | "action_required"
  | "blocked"
  | "incident_hold";

export type ProjectSort = "attention" | "activity" | "name";
export type SortDirection = "asc" | "desc";

export interface ProjectListQuery {
  q?: string;
  archived?: boolean;
  attention?: ProjectAttentionFilter[];
  sort?: ProjectSort;
  direction?: SortDirection;
  cursor?: string;
  limit?: number;
}

/** Global freshness-only stream event, GET /v1/events (P-01.4 / API §7). */
export type GlobalControlEventType =
  | "project.attention.changed"
  | "project.archived.changed"
  | "human_decision.required"
  | "incident.updated";

export interface GlobalControlEvent {
  id: string;
  type: GlobalControlEventType;
  occurredAt: string;
  projectKey: string;
  traceId: string;
  resource: { type: string; key: string };
  summary: {
    operationalStatus?: ProjectOperationalStatus;
    attentionSeverity?: AttentionSeverity;
    attentionReasons?: ProjectAttentionReason[];
    resourceVersion?: string;
    state?: string;
  };
  href: string;
}
