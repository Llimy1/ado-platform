/**
 * Mirrors GET /v1/projects/{projectKey}/decisions and
 * GET /v1/projects/{projectKey}/decisions/{decisionKey} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-09.1. Hand-maintained UI-prototype types;
 * see note in ./projects.ts.
 */
import type { AttentionSeverity } from "./projects";

export type DecisionTargetType = "feature_unit" | "component_work" | "incident" | "configuration";
export type DecisionStatus = "pending" | "expired" | "superseded" | "resolved" | "denied";

export interface DecisionListItem {
  decisionKey: string;
  decisionType: string;
  status: DecisionStatus;
  severity: AttentionSeverity;
  target: { type: DecisionTargetType; key: string; title: string; href: string };
  requestedActor: string;
  requestedAt: string;
  dueAt: string | null;
  expiresAt: string | null;
  /** Human-readable summary of the PolicyDecision/EvidenceGate that produced this request. */
  gateSummary: string;
  allowedActionCount: number;
  href: string;
}

export interface DecisionListResponse {
  items: DecisionListItem[];
  scope: { projectKey: string | null; projectName: string | null };
  page: { limit: number; nextCursor: string | null; hasMore: boolean };
  summary: { totalCount: number; expiredCount: number; criticalCount: number };
  snapshot: { observedAt: string; requestId: string };
}

export interface DecisionChoice {
  choiceKey: string;
  label: string;
  /** Whether choosing this option requires a 10-2,000 character reason. */
  reasonRequired: boolean;
}

export interface DecisionDetailResponse {
  decision: {
    decisionKey: string;
    decisionType: string;
    status: DecisionStatus;
    severity: AttentionSeverity;
    target: { type: DecisionTargetType; key: string; title: string; href: string };
    requestedActor: string;
    requestedAt: string;
    dueAt: string | null;
    expiresAt: string | null;
    resourceVersion: string;
  };
  gateSummary: string;
  evidenceManifest: Array<{ label: string; href: string; kind: string }>;
  /** Only present when the API authorizes a decision here; empty means read-only routing to the owning page. */
  allowedChoices: DecisionChoice[];
  priorDecisionHref: string | null;
  supersedingDecisionHref: string | null;
  resolution: {
    choiceKey: string | null;
    decidedAt: string | null;
    actorLabel: string | null;
    reason: string | null;
  };
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}
