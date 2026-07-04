/**
 * Mirrors GET /v1/incidents and
 * GET /v1/projects/{projectKey}/incidents/{incidentKey} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-09.2. Hand-maintained UI-prototype types;
 * see note in ./projects.ts.
 */

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentState = "open" | "acknowledged" | "recovery_requested" | "recovering" | "resolved";
export type IncidentAllowedAction = "acknowledge" | "request_recovery";

export interface IncidentListItem {
  incidentKey: string;
  projectKey: string;
  projectName: string;
  title: string;
  severity: IncidentSeverity;
  state: IncidentState;
  openedAt: string;
  affectedSummary: string;
  activePauseCount: number;
  href: string;
}

export interface IncidentListResponse {
  items: IncidentListItem[];
  page: { limit: number; nextCursor: string | null; hasMore: boolean };
  summary: { openCount: number; criticalCount: number };
  snapshot: { observedAt: string; requestId: string };
}

export interface IncidentDetailResponse {
  incident: {
    incidentKey: string;
    projectKey: string;
    projectName: string;
    title: string;
    severity: IncidentSeverity;
    state: IncidentState;
    openedAt: string;
    resourceVersion: string;
  };
  safetyEvent: { safetyEventKey: string; kind: string; detectedAt: string; summary: string };
  affected: {
    featureUnits: Array<{ featureUnitKey: string; title: string; href: string }>;
    componentWorks: Array<{ componentWorkKey: string; title: string; href: string }>;
    jobAttempts: Array<{ jobAttemptId: string; title: string; href: string }>;
  };
  activePauseRecords: Array<{
    pauseRecordKey: string;
    scopeLabel: string;
    reason: string;
    pausedAt: string;
    pausedByLabel: string;
  }>;
  summaryArtifact: { artifactKey: string; href: string } | null;
  recoveryEvidence: {
    required: string[];
    submitted: Array<{ label: string; href: string }>;
  };
  decisions: Array<{ decisionKey: string; title: string; status: string; href: string }>;
  timeline: {
    items: Array<{ eventKey: string; occurredAt: string; actorLabel: string; summary: string; evidenceHref: string | null }>;
    omittedCount: number;
  };
  allowedActions: IncidentAllowedAction[];
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}
