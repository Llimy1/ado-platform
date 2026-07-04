import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

/**
 * In-memory mock read model standing in for the Component Work projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-05.2. Prototype-only data;
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

/**
 * Nested-address enforcement (P-11.3): each fixture is only served under its
 * actual project/roadmap/featureUnit scope. See the identical fix in
 * feature-unit-store.ts for why this check exists.
 */
const SCOPE: Record<string, { projectKey: string; roadmapKey: string; featureUnitKey: string }> = {
  "cw-orion-1": { projectKey: "orion-billing", roadmapKey: "rm-01", featureUnitKey: "fu-orion-402" },
  "cw-orion-2": { projectKey: "orion-billing", roadmapKey: "rm-01", featureUnitKey: "fu-orion-402" },
  "cw-orion-3": { projectKey: "orion-billing", roadmapKey: "rm-01", featureUnitKey: "fu-orion-402" },
  "cw-orion-4": { projectKey: "orion-billing", roadmapKey: "rm-01", featureUnitKey: "fu-orion-402" },
};

const RICH: Record<string, ComponentWorkDetailResponse> = {
  "cw-orion-1": {
    work: {
      componentWorkKey: "cw-orion-1",
      title: "재시도 큐 레코드 스키마",
      intent: "재시도 큐 레코드에 멱등 키와 백오프 스케줄을 저장할 수 있도록 스키마를 확장한다.",
      state: "blocked",
      riskLevel: "high",
      executionScope: "single",
      required: true,
      primaryComponent: { key: "billing-worker", displayName: "Billing Worker" },
      scopes: [
        {
          componentKey: "billing-worker",
          displayName: "Billing Worker",
          relativeRoot: "services/billing-worker",
          role: "primary",
          required: true,
        },
      ],
      repository: {
        remoteUrlRedacted: "git@github.com:***/orion-billing.git",
        integrationBranch: "integrate",
        baseBranch: "integrate",
        headBranch: "codex/cw-orion-1-retry-queue-schema",
      },
      worktree: { worktreeKey: "wt-cw1", status: "active", baseCommit: "a1b2c3d", headCommit: "e4f5g6h" },
      allowedPaths: { version: "v4", writeRuleCount: 3, href: "/projects/orion-billing/artifacts/allowed-paths-v4" },
      resourceVersion: "rv-cw1-7",
    },
    commandGate: {
      paused: false,
      pauseReason: null,
      allowedActions: ["retry", "cancel"],
      actionRequirements: {
        retry: { expectedResourceVersion: "rv-cw1-7", reasonRequired: true, confirmation: "dialog" },
        cancel: { expectedResourceVersion: "rv-cw1-7", reasonRequired: true, confirmation: "destructive_dialog" },
      },
    },
    activeExecution: {
      jobAttemptId: null,
      jobKey: null,
      state: "none",
      runnerLabel: null,
      startedAt: null,
      timeoutAt: null,
      lastHeartbeatAt: null,
      href: null,
    },
    verification: {
      state: "failed",
      latestVerificationRunId: "vr-cw1-3",
      requiredCommandCount: 4,
      passedCommandCount: 1,
      failedCommandCount: 3,
      href: "/verification-runs/vr-cw1-3",
    },
    review: {
      state: "not_started",
      reviewGroupId: null,
      acceptedP0P1FindingCount: 0,
      unresolvedFindingCount: 0,
      href: null,
    },
    pullRequest: null,
    attempts: {
      items: [
        {
          jobAttemptId: "ja-cw1-3",
          attemptNumber: 3,
          state: "failed",
          workerLabel: "worker-macos-3",
          startedAt: iso(0, 2),
          finishedAt: iso(0, 1),
          timeoutAt: iso(0, 1),
          failureCode: "verification_command_failed",
          redactedSummary: "필수 검증 명령 4건 중 3건 실패 (마이그레이션 충돌)",
          href: "/runs/ja-cw1-3",
        },
        {
          jobAttemptId: "ja-cw1-2",
          attemptNumber: 2,
          state: "failed",
          workerLabel: "worker-macos-1",
          startedAt: iso(0, 6),
          finishedAt: iso(0, 5),
          timeoutAt: iso(0, 5),
          failureCode: "verification_command_failed",
          redactedSummary: "필수 검증 명령 4건 중 2건 실패",
          href: "/runs/ja-cw1-2",
        },
        {
          jobAttemptId: "ja-cw1-1",
          attemptNumber: 1,
          state: "failed",
          workerLabel: "worker-linux-2",
          startedAt: iso(0, 10),
          finishedAt: iso(0, 9),
          timeoutAt: iso(0, 9),
          failureCode: "verification_command_failed",
          redactedSummary: "필수 검증 명령 4건 중 1건 실패",
          href: "/runs/ja-cw1-1",
        },
      ],
      omittedCount: 0,
    },
    timeline: {
      items: [
        {
          eventKey: "cw1-tl-1",
          occurredAt: iso(0, 1),
          summary: "3회 연속 검증 실패로 사고가 개설되고 이 Work가 차단되었습니다",
          evidenceHref: "/projects/orion-billing/incidents/inc-501",
        },
        {
          eventKey: "cw1-tl-2",
          occurredAt: iso(0, 5),
          summary: "2번째 시도가 검증 실패로 종료되었습니다",
          evidenceHref: "/runs/ja-cw1-2",
        },
        {
          eventKey: "cw1-tl-3",
          occurredAt: iso(0, 9),
          summary: "1번째 시도가 검증 실패로 종료되었습니다",
          evidenceHref: "/runs/ja-cw1-1",
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot("rv-cw1-7"),
  },
  "cw-orion-3": {
    work: {
      componentWorkKey: "cw-orion-3",
      title: "PR 리뷰 반영",
      intent: "정산 API 멱등성 키 리뷰 지적사항을 반영하고 PR을 최종 승인 가능한 상태로 만든다.",
      state: "pr_created",
      riskLevel: "normal",
      executionScope: "single",
      required: true,
      primaryComponent: { key: "billing-api", displayName: "Billing API" },
      scopes: [
        {
          componentKey: "billing-api",
          displayName: "Billing API",
          relativeRoot: "services/billing-api",
          role: "primary",
          required: true,
        },
      ],
      repository: {
        remoteUrlRedacted: "git@github.com:***/orion-billing.git",
        integrationBranch: "integrate",
        baseBranch: "integrate",
        headBranch: "codex/cw-orion-3-pr-review-fixes",
      },
      worktree: { worktreeKey: "wt-cw3", status: "archived", baseCommit: "b7c8d9e", headCommit: "f0a1b2c" },
      allowedPaths: { version: "v4", writeRuleCount: 2, href: "/projects/orion-billing/artifacts/allowed-paths-v4" },
      resourceVersion: "rv-cw3-4",
    },
    commandGate: {
      paused: false,
      pauseReason: null,
      allowedActions: [],
      actionRequirements: {},
    },
    activeExecution: {
      jobAttemptId: null,
      jobKey: null,
      state: "none",
      runnerLabel: null,
      startedAt: null,
      timeoutAt: null,
      lastHeartbeatAt: null,
      href: null,
    },
    verification: {
      state: "passed",
      latestVerificationRunId: "vr-cw3-1",
      requiredCommandCount: 3,
      passedCommandCount: 3,
      failedCommandCount: 0,
      href: "/verification-runs/vr-cw3-1",
    },
    review: {
      state: "passed",
      reviewGroupId: "rg-cw3-1",
      acceptedP0P1FindingCount: 0,
      unresolvedFindingCount: 0,
      href: "/reviews/rg-cw3-1",
    },
    pullRequest: {
      pullRequestId: "pr-214",
      url: "https://github.com/***/orion-billing/pull/214",
      baseBranch: "integrate",
      headBranch: "codex/cw-orion-3-pr-review-fixes",
      status: "open",
      createdAt: iso(1, 0),
    },
    attempts: {
      items: [
        {
          jobAttemptId: "ja-cw3-1",
          attemptNumber: 1,
          state: "succeeded",
          workerLabel: "worker-macos-2",
          startedAt: iso(1, 2),
          finishedAt: iso(1, 1),
          timeoutAt: iso(1, 1),
          failureCode: null,
          redactedSummary: "검증 3건 통과, PR #214 생성",
          href: "/runs/ja-cw3-1",
        },
      ],
      omittedCount: 0,
    },
    timeline: {
      items: [
        {
          eventKey: "cw3-tl-1",
          occurredAt: iso(1, 0),
          summary: "PR #214가 생성되었습니다",
          evidenceHref: "/pull-requests/pr-214",
        },
        {
          eventKey: "cw3-tl-2",
          occurredAt: iso(1, 1),
          summary: "검증 3건이 모두 통과했습니다",
          evidenceHref: "/verification-runs/vr-cw3-1",
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot("rv-cw3-4"),
  },
  "cw-orion-2": {
    work: {
      componentWorkKey: "cw-orion-2",
      title: "정산 API 멱등성 키",
      intent: "정산 API 호출에 멱등 키를 도입해 재시도 시 중복 정산을 방지한다.",
      state: "needs_revision",
      riskLevel: "high",
      executionScope: "coordinated",
      required: true,
      primaryComponent: { key: "billing-api", displayName: "Billing API" },
      scopes: [
        {
          componentKey: "billing-api",
          displayName: "Billing API",
          relativeRoot: "services/billing-api",
          role: "primary",
          required: true,
        },
        {
          componentKey: "billing-worker",
          displayName: "Billing Worker",
          relativeRoot: "services/billing-worker",
          role: "shared_contract",
          required: true,
        },
      ],
      repository: {
        remoteUrlRedacted: "git@github.com:***/orion-billing.git",
        integrationBranch: "integrate",
        baseBranch: "integrate",
        headBranch: "codex/cw-orion-2-idempotency-key",
      },
      worktree: { worktreeKey: "wt-cw2", status: "active", baseCommit: "c3d4e5f", headCommit: "g6h7i8j" },
      allowedPaths: { version: "v4", writeRuleCount: 2, href: "/projects/orion-billing/artifacts/allowed-paths-v4" },
      resourceVersion: "rv-cw2-5",
    },
    commandGate: {
      paused: false,
      pauseReason: null,
      allowedActions: ["retry", "cancel"],
      actionRequirements: {
        retry: { expectedResourceVersion: "rv-cw2-5", reasonRequired: true, confirmation: "dialog" },
        cancel: { expectedResourceVersion: "rv-cw2-5", reasonRequired: true, confirmation: "destructive_dialog" },
      },
    },
    activeExecution: {
      jobAttemptId: null,
      jobKey: null,
      state: "none",
      runnerLabel: null,
      startedAt: null,
      timeoutAt: null,
      lastHeartbeatAt: null,
      href: null,
    },
    verification: {
      state: "not_started",
      latestVerificationRunId: null,
      requiredCommandCount: 0,
      passedCommandCount: 0,
      failedCommandCount: 0,
      href: null,
    },
    review: {
      state: "changes_requested",
      reviewGroupId: "rg-cw2-1",
      acceptedP0P1FindingCount: 1,
      unresolvedFindingCount: 1,
      href: "/reviews/rg-cw2-1",
    },
    pullRequest: null,
    attempts: { items: [], omittedCount: 0 },
    timeline: {
      items: [
        {
          eventKey: "cw2-tl-1",
          occurredAt: iso(0, 3),
          summary: "정산 API 멱등성 키 변경에 대해 변경 요청이 접수되었습니다",
          evidenceHref: "/reviews/rg-cw2-1",
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot("rv-cw2-5"),
  },
};

interface FallbackSeed {
  componentWorkKey: string;
  title: string;
  primaryComponentKey: string;
  primaryComponentName: string;
  state: string;
  required: boolean;
}

const FALLBACK_SEEDS: FallbackSeed[] = [
  {
    componentWorkKey: "cw-orion-4",
    title: "재시도 정책 문서화",
    primaryComponentKey: "docs",
    primaryComponentName: "Docs",
    state: "queued",
    required: false,
  },
];

function buildFallbackDetail(seed: FallbackSeed): ComponentWorkDetailResponse {
  const rv = `rv-${seed.componentWorkKey}-fallback`;
  return {
    work: {
      componentWorkKey: seed.componentWorkKey,
      title: seed.title,
      intent: `${seed.title} 작업을 완료해 필요한 컴포넌트 변경을 반영한다.`,
      state: seed.state,
      riskLevel: "normal",
      executionScope: "single",
      required: seed.required,
      primaryComponent: { key: seed.primaryComponentKey, displayName: seed.primaryComponentName },
      scopes: [
        {
          componentKey: seed.primaryComponentKey,
          displayName: seed.primaryComponentName,
          relativeRoot: `services/${seed.primaryComponentKey}`,
          role: "primary",
          required: true,
        },
      ],
      repository: {
        remoteUrlRedacted: "git@github.com:***/orion-billing.git",
        integrationBranch: "integrate",
        baseBranch: "integrate",
        headBranch: seed.state === "queued" ? null : `codex/${seed.componentWorkKey}`,
      },
      worktree: null,
      allowedPaths: { version: "v4", writeRuleCount: 1, href: null },
      resourceVersion: rv,
    },
    commandGate: {
      paused: false,
      pauseReason: null,
      allowedActions: seed.state === "queued" ? [] : ["cancel"],
      actionRequirements:
        seed.state === "queued"
          ? {}
          : { cancel: { expectedResourceVersion: rv, reasonRequired: true, confirmation: "destructive_dialog" } },
    },
    activeExecution: {
      jobAttemptId: null,
      jobKey: null,
      state: "none",
      runnerLabel: null,
      startedAt: null,
      timeoutAt: null,
      lastHeartbeatAt: null,
      href: null,
    },
    verification: { state: "not_started", latestVerificationRunId: null, requiredCommandCount: 0, passedCommandCount: 0, failedCommandCount: 0, href: null },
    review: { state: "not_started", reviewGroupId: null, acceptedP0P1FindingCount: 0, unresolvedFindingCount: 0, href: null },
    pullRequest: null,
    attempts: { items: [], omittedCount: 0 },
    timeline: { items: [], omittedCount: 0 },
    snapshot: snapshot(rv),
  };
}

export function getComponentWorkDetail(
  projectKey: string,
  roadmapKey: string,
  featureUnitKey: string,
  componentWorkKey: string,
): ComponentWorkDetailResponse | null {
  const scope = SCOPE[componentWorkKey];
  if (!scope || scope.projectKey !== projectKey || scope.roadmapKey !== roadmapKey || scope.featureUnitKey !== featureUnitKey) {
    return null;
  }

  const rich = RICH[componentWorkKey];
  if (rich) return rich;
  const seed = FALLBACK_SEEDS.find((s) => s.componentWorkKey === componentWorkKey);
  return seed ? buildFallbackDetail(seed) : null;
}
