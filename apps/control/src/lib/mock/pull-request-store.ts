import type { PullRequestDetailResponse } from "@/lib/contracts/pull-request";

/**
 * In-memory mock read model standing in for the PullRequest projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-08.2. Prototype-only data;
 * no database or Spring service is involved.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

const CW3_HREF = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3";

const PULL_REQUESTS: Record<string, PullRequestDetailResponse> = {
  "pr-214": {
    pullRequest: {
      pullRequestId: "pr-214",
      componentWorkHref: CW3_HREF,
      componentWorkTitle: "PR 리뷰 반영",
      provider: "github",
      externalNumber: 214,
      externalUrl: "https://github.com/***/orion-billing/pull/214",
      baseBranch: "integrate",
      headBranch: "codex/cw-orion-3-pr-review-fixes",
      createdAt: iso(1, 0),
      lastSyncedAt: iso(0, 6),
      status: "open",
    },
    packet: { artifactKey: "artifact-pr-214-packet", href: "/projects/orion-billing/artifacts/artifact-pr-214-packet" },
    specRevision: { revision: "spec-v0.1.0", contentSha256: "a1d4995e" },
    gitSnapshot: { commitId: "f0a1b2c", treeId: "t-3d4e5f" },
    verificationSummary: { state: "passed", requiredPassed: true, href: "/verification-runs/vr-cw3-1" },
    reviewSummary: { state: "passed", arbiterDecision: "ready_for_pr", href: "/reviews/rg-cw3-1" },
    changedPaths: {
      items: [
        { path: "services/billing-api/idempotency.py", changeType: "modified", href: null },
        { path: "services/billing-api/tests/test_idempotency.py", changeType: "modified", href: null },
        { path: "services/billing-api/CHANGELOG.md", changeType: "modified", href: null },
      ],
      omittedCount: 0,
    },
    syncTimeline: {
      items: [
        { eventKey: "pr214-tl-1", occurredAt: iso(1, 0), summary: "PR이 생성되었습니다", evidenceHref: null },
        { eventKey: "pr214-tl-2", occurredAt: iso(0, 6), summary: "원격 저장소와 동기화되었습니다", evidenceHref: null },
      ],
      omittedCount: 0,
    },
    snapshot: {
      observedAt: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      resourceVersion: "rv-pr-214",
    },
  },
};

interface FallbackPrSeed {
  pullRequestId: string;
  componentWorkHref: string;
  componentWorkTitle: string;
  externalNumber: number;
  headBranch: string;
  status: string;
  createdAgoDays: number;
}

const FALLBACK_SEEDS: FallbackPrSeed[] = [
  {
    pullRequestId: "pr-198",
    componentWorkHref: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-404/component-works/cw-orion-5",
    componentWorkTitle: "리포트 생성 배치",
    externalNumber: 198,
    headBranch: "codex/cw-orion-5-report-batch",
    status: "merged",
    createdAgoDays: 4,
  },
  {
    pullRequestId: "pr-199",
    componentWorkHref: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-404/component-works/cw-orion-6",
    componentWorkTitle: "발송 알림 템플릿",
    externalNumber: 199,
    headBranch: "codex/cw-orion-6-notification-template",
    status: "merged",
    createdAgoDays: 3,
  },
];

function buildFallbackDetail(seed: FallbackPrSeed): PullRequestDetailResponse {
  return {
    pullRequest: {
      pullRequestId: seed.pullRequestId,
      componentWorkHref: seed.componentWorkHref,
      componentWorkTitle: seed.componentWorkTitle,
      provider: "github",
      externalNumber: seed.externalNumber,
      externalUrl: `https://github.com/***/orion-billing/pull/${seed.externalNumber}`,
      baseBranch: "integrate",
      headBranch: seed.headBranch,
      createdAt: iso(seed.createdAgoDays),
      lastSyncedAt: iso(seed.createdAgoDays - 1),
      status: seed.status,
    },
    packet: null,
    specRevision: { revision: "spec-v0.1.0", contentSha256: "a1d4995e" },
    gitSnapshot: { commitId: "unknown", treeId: "unknown" },
    verificationSummary: { state: "passed", requiredPassed: true, href: null },
    reviewSummary: { state: "passed", arbiterDecision: "ready_for_pr", href: null },
    changedPaths: { items: [], omittedCount: 0 },
    syncTimeline: { items: [], omittedCount: 0 },
    snapshot: {
      observedAt: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      resourceVersion: `rv-${seed.pullRequestId}`,
    },
  };
}

export function getPullRequestDetail(pullRequestId: string): PullRequestDetailResponse | null {
  const rich = PULL_REQUESTS[pullRequestId];
  if (rich) return rich;
  const seed = FALLBACK_SEEDS.find((s) => s.pullRequestId === pullRequestId);
  return seed ? buildFallbackDetail(seed) : null;
}
