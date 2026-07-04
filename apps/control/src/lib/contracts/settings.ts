/**
 * Mirrors the read-only /settings inspection surface from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.3. No mutation fields exist in v1 —
 * configuration changes are a separately approved future use case. See note
 * in ./projects.ts.
 */

export interface SettingsResponse {
  specRevision: { revision: number; contentSha256: string; manifestHref: string };
  apiVersion: string;
  uiVersion: string;
  session: { operatorLabel: string; role: string };
  repositoryPolicy: { publicRepositoriesAllowed: boolean; note: string };
  branchPolicy: { integrationBranch: string; baseBranchForPr: string; note: string };
  activeConstraintProfiles: Array<{
    projectKey: string;
    projectName: string;
    version: number;
    approvedAt: string;
    href: string;
  }>;
  approvedConfigurationDecisions: Array<{ decisionKey: string; title: string; decidedAt: string; href: string }>;
  snapshot: { observedAt: string; requestId: string };
}
