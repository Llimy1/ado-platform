/**
 * Mirrors GET /v1/review-groups/{reviewGroupId} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-07.3. Hand-maintained UI-prototype
 * types; see note in ./projects.ts. Read-only — no commands exist on this
 * route (no "ignore finding" action).
 */

export type FindingSeverity = "P0" | "P1" | "P2" | "P3" | "info";
export type FindingResolution = "accepted" | "rejected" | "human_required" | "informational";
export type ArbiterDecisionValue = "ready_for_pr" | "needs_revision" | "human_required" | "blocked";

export interface ReviewGroupDetailResponse {
  reviewGroup: {
    reviewGroupId: string;
    componentWorkHref: string;
    componentWorkTitle: string;
    reviewPacket: { artifactKey: string; contentSha256: string; href: string | null };
    riskLevel: string;
    requiredReviewerCount: number;
    state: string;
  };
  reviewers: Array<{
    reviewerKey: string;
    provider: string;
    modelIdentifier: string;
    status: string;
    completedAt: string | null;
    resultArtifactHref: string | null;
  }>;
  findings: Array<{
    findingKey: string;
    deduplicationHash: string;
    severity: FindingSeverity;
    category: string;
    title: string;
    fileHref: string | null;
    sourceReviewerCount: number;
    resolution: FindingResolution;
    evidenceHref: string | null;
    revisionTaskHref: string | null;
  }>;
  arbiterDecision: {
    decision: ArbiterDecisionValue;
    decisionArtifactHref: string | null;
    decidedAt: string;
    summary: string;
    unresolvedAcceptedFindingCount: number;
    prCreationPermitted: boolean;
  } | null;
  revisionTasks: Array<{ revisionTaskKey: string; title: string; state: string; href: string }>;
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}
