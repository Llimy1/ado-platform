import type { ReviewGroupDetailResponse } from "@/lib/contracts/review-group";

/**
 * In-memory mock read model standing in for the ReviewGroup projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-07.3. Prototype-only data;
 * no database or Spring service is involved.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

function snapshot(resourceVersion: string) {
  return {
    observedAt: new Date().toISOString(),
    requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
    resourceVersion,
  };
}

const CW2_HREF = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-2";
const CW3_HREF = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3";

const GROUPS: Record<string, ReviewGroupDetailResponse> = {
  "rg-cw2-1": {
    reviewGroup: {
      reviewGroupId: "rg-cw2-1",
      componentWorkHref: CW2_HREF,
      componentWorkTitle: "정산 API 멱등성 키",
      reviewPacket: {
        artifactKey: "artifact-rg-cw2-1-packet",
        contentSha256: "9b2e7f1a",
        href: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-packet",
      },
      riskLevel: "high",
      requiredReviewerCount: 2,
      state: "completed",
    },
    reviewers: [
      {
        reviewerKey: "reviewer-local-1",
        provider: "codex",
        modelIdentifier: "codex-review-1",
        status: "completed",
        completedAt: iso(0, 3),
        resultArtifactHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-reviewer-1",
      },
      {
        reviewerKey: "reviewer-local-2",
        provider: "codex",
        modelIdentifier: "codex-review-2",
        status: "completed",
        completedAt: iso(0, 3),
        resultArtifactHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-reviewer-2",
      },
    ],
    findings: [
      {
        findingKey: "fnd-cw2-1",
        deduplicationHash: "dedup-a1",
        severity: "P1",
        category: "correctness",
        title: "멱등 키가 요청 헤더 대소문자를 구분하지 않아 충돌 가능성이 있습니다",
        fileHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-packet#L42",
        sourceReviewerCount: 2,
        resolution: "accepted",
        evidenceHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-reviewer-1",
        revisionTaskHref: "/reviews/rg-cw2-1#revision-task-rt-cw2-1",
      },
      {
        findingKey: "fnd-cw2-2",
        deduplicationHash: "dedup-a2",
        severity: "P2",
        category: "style",
        title: "에러 메시지에 내부 큐 이름이 그대로 노출됩니다",
        fileHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-packet#L88",
        sourceReviewerCount: 1,
        resolution: "human_required",
        evidenceHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-reviewer-2",
        revisionTaskHref: null,
      },
    ],
    arbiterDecision: {
      decision: "needs_revision",
      decisionArtifactHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-arbiter",
      decidedAt: iso(0, 3),
      summary: "P1 지적사항 1건이 승인되어 재작업이 필요합니다. PR 생성은 보류됩니다.",
      unresolvedAcceptedFindingCount: 1,
      prCreationPermitted: false,
    },
    revisionTasks: [
      {
        revisionTaskKey: "rt-cw2-1",
        title: "멱등 키 대소문자 정규화 처리 추가",
        state: "open",
        href: "/reviews/rg-cw2-1#revision-task-rt-cw2-1",
      },
    ],
    snapshot: snapshot("rv-rg-cw2-1"),
  },
  "rg-cw3-1": {
    reviewGroup: {
      reviewGroupId: "rg-cw3-1",
      componentWorkHref: CW3_HREF,
      componentWorkTitle: "PR 리뷰 반영",
      reviewPacket: {
        artifactKey: "artifact-rg-cw3-1-packet",
        contentSha256: "4c8d1e6b",
        href: "/projects/orion-billing/artifacts/artifact-rg-cw3-1-packet",
      },
      riskLevel: "normal",
      requiredReviewerCount: 1,
      state: "completed",
    },
    reviewers: [
      {
        reviewerKey: "reviewer-local-1",
        provider: "codex",
        modelIdentifier: "codex-review-1",
        status: "completed",
        completedAt: iso(1, 1),
        resultArtifactHref: "/projects/orion-billing/artifacts/artifact-rg-cw3-1-reviewer-1",
      },
    ],
    findings: [],
    arbiterDecision: {
      decision: "ready_for_pr",
      decisionArtifactHref: "/projects/orion-billing/artifacts/artifact-rg-cw3-1-arbiter",
      decidedAt: iso(1, 1),
      summary: "지적사항이 없어 PR 생성이 허용됩니다.",
      unresolvedAcceptedFindingCount: 0,
      prCreationPermitted: true,
    },
    revisionTasks: [],
    snapshot: snapshot("rv-rg-cw3-1"),
  },
};

export function getReviewGroupDetail(reviewGroupId: string): ReviewGroupDetailResponse | null {
  return GROUPS[reviewGroupId] ?? null;
}
