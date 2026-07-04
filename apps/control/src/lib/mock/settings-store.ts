import type { SettingsResponse } from "@/lib/contracts/settings";

/**
 * In-memory mock read model standing in for the read-only /settings
 * inspection surface described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.3.
 * There is no mutation form in v1 — every field here is a labelled
 * definition list value, never an editable input.
 */

function iso(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString();
}

export function getSettings(): SettingsResponse {
  return {
    specRevision: { revision: 3, contentSha256: "s3c1a2b3c4d5", manifestHref: "/projects/orion-billing/artifacts/artifact-rm-01-manifest" },
    apiVersion: "v1.42.0",
    uiVersion: "control-room-prototype-0.1.0",
    session: { operatorLabel: "Human Owner", role: "operator" },
    repositoryPolicy: { publicRepositoriesAllowed: false, note: "모든 Repository는 비공개여야 하며, 승인된 조직 계정 아래에서만 생성됩니다." },
    branchPolicy: { integrationBranch: "integrate", baseBranchForPr: "integrate", note: "모든 Component Work PR은 integrate 브랜치를 base로 사용합니다. ADO는 병합 명령을 제공하지 않습니다." },
    activeConstraintProfiles: [
      { projectKey: "orion-billing", projectName: "Orion 결제 플랫폼", version: 4, approvedAt: iso(30), href: "/projects/orion-billing/artifacts/constraint-profile-4" },
      { projectKey: "atlas-fulfillment", projectName: "Atlas 풀필먼트", version: 1, approvedAt: iso(60), href: "/projects/atlas-fulfillment/artifacts/constraint-profile-1" },
      { projectKey: "nova-support", projectName: "Nova 고객 지원 콘솔", version: 1, approvedAt: iso(60), href: "/projects/nova-support/artifacts/constraint-profile-1" },
    ],
    approvedConfigurationDecisions: [],
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  };
}
