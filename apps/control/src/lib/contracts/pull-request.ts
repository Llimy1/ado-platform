/**
 * Mirrors GET /v1/pull-requests/{pullRequestId} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-08.2. Hand-maintained UI-prototype
 * types; see note in ./projects.ts. Read-only — ADO never renders a merge
 * command here.
 */

export interface PullRequestDetailResponse {
  pullRequest: {
    pullRequestId: string;
    componentWorkHref: string;
    componentWorkTitle: string;
    provider: string;
    externalNumber: number;
    externalUrl: string;
    baseBranch: string;
    headBranch: string;
    createdAt: string;
    lastSyncedAt: string;
    status: string;
  };
  packet: { artifactKey: string; href: string | null } | null;
  specRevision: { revision: string; contentSha256: string };
  gitSnapshot: { commitId: string; treeId: string };
  verificationSummary: { state: string; requiredPassed: boolean; href: string | null };
  reviewSummary: { state: string; arbiterDecision: string | null; href: string | null };
  changedPaths: {
    items: Array<{ path: string; changeType: "added" | "modified" | "deleted"; href: string | null }>;
    omittedCount: number;
  };
  syncTimeline: {
    items: Array<{ eventKey: string; occurredAt: string; summary: string; evidenceHref: string | null }>;
    omittedCount: number;
  };
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}
