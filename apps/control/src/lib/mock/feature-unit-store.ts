import type {
  FeatureUnitActivationGateState,
  FeatureUnitDetailResponse,
  FeatureUnitPlanningGateState,
  FeatureUnitRiskLevel,
} from "@/lib/contracts/feature-unit";

/**
 * In-memory mock read model standing in for the FeatureUnitDetailProjection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-04.2. Prototype-only data;
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
 * Nested-address enforcement (P-11.3): each rich fixture is only served
 * under its actual projectKey/roadmapKey. Without this, requesting a real
 * featureUnitKey nested under an unrelated project/roadmap would silently
 * return the wrong resource instead of a not-found result.
 */
const RICH_SCOPE: Record<string, { projectKey: string; roadmapKey: string }> = {
  "fu-orion-402": { projectKey: "orion-billing", roadmapKey: "rm-01" },
  "fu-orion-404": { projectKey: "orion-billing", roadmapKey: "rm-01" },
  "fu-orion-501": { projectKey: "orion-billing", roadmapKey: "rm-02" },
};

const RICH: Record<string, FeatureUnitDetailResponse> = {
  "fu-orion-402": {
    featureUnit: {
      featureUnitKey: "fu-orion-402",
      sequenceNumber: 2,
      title: "정산 배치 재시도 정책",
      intent: "정산 배치가 일시적 실패 후에도 안전하게 재시도되도록 재시도 횟수, 백오프, 중복 방지 정책을 도입한다.",
      state: "blocked",
      riskLevel: "high",
      constraintProfile: { version: 4, contentSha256: "a1c4e7b2", href: "/projects/orion-billing/artifacts/constraint-profile-4" },
      spec: {
        artifactKey: "spec-fu-orion-402",
        revision: 3,
        contentSha256: "77d2f9a1",
        status: "valid",
        href: "/projects/orion-billing/artifacts/spec-fu-orion-402",
      },
      resourceVersion: "rv-fu402-9",
    },
    planningGate: {
      state: "approved",
      explanationCode: "already_approved",
      allowedActions: [],
      expectedResourceVersion: "rv-fu402-9",
    },
    activationGate: {
      state: "blocked",
      unmetDependencyCount: 0,
      waivedDependencyCount: 0,
      pauseOrIncidentBlocking: true,
      explanationCode: "blocked_by_open_incident",
    },
    acceptanceCriteria: {
      items: [
        {
          criterionKey: "ac-1",
          description: "3회 연속 실패 시 지수 백오프로 재시도한다",
          verificationMode: "command",
          required: true,
          status: "failed",
          evidenceHref: "/runs/run-fu402-3",
        },
        {
          criterionKey: "ac-2",
          description: "재시도 큐 레코드는 멱등 키로 중복 처리를 방지한다",
          verificationMode: "artifact_review",
          required: true,
          status: "needs_revision",
          evidenceHref: "/reviews/rg-fu402-2",
        },
        {
          criterionKey: "ac-3",
          description: "재시도 한도 초과 시 사고를 개설한다",
          verificationMode: "human_check",
          required: true,
          status: "not_started",
          evidenceHref: null,
        },
        {
          criterionKey: "ac-4",
          description: "재시도 정책 변경 시 감사 이벤트를 남긴다",
          verificationMode: "mixed",
          required: false,
          status: "passed",
          evidenceHref: "/verification-runs/vr-fu402-1",
        },
      ],
      totalCount: 4,
      requiredCount: 3,
    },
    dependencies: {
      prerequisites: [
        {
          featureUnitKey: "fu-orion-401",
          title: "정산 배치 스케줄러",
          relation: "depends_on",
          satisfied: true,
          waivedByDecisionHref: null,
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-401",
        },
      ],
      dependents: [
        {
          featureUnitKey: "fu-orion-403",
          title: "정산 실패 알림",
          relation: "depends_on",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-403",
        },
        {
          featureUnitKey: "fu-orion-408",
          title: "결제 재시도 알림 UX",
          relation: "depends_on",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-408",
        },
      ],
    },
    componentWork: {
      items: [
        {
          componentWorkKey: "cw-orion-1",
          title: "재시도 큐 레코드 스키마",
          primaryComponent: { key: "billing-worker", displayName: "Billing Worker" },
          executionScope: "single",
          scopeComponents: [{ key: "billing-worker", displayName: "Billing Worker", role: "primary" }],
          required: true,
          state: "blocked",
          verification: "failed",
          review: "not_started",
          pullRequest: null,
          attentionSeverity: "critical",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-1",
        },
        {
          componentWorkKey: "cw-orion-2",
          title: "정산 API 멱등성 키",
          primaryComponent: { key: "billing-api", displayName: "Billing API" },
          executionScope: "coordinated",
          scopeComponents: [
            { key: "billing-api", displayName: "Billing API", role: "primary" },
            { key: "billing-worker", displayName: "Billing Worker", role: "shared_contract" },
          ],
          required: true,
          state: "needs_revision",
          verification: "not_applicable",
          review: "changes_requested",
          pullRequest: null,
          attentionSeverity: "warning",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-2",
        },
        {
          componentWorkKey: "cw-orion-3",
          title: "PR 리뷰 반영",
          primaryComponent: { key: "billing-api", displayName: "Billing API" },
          executionScope: "single",
          scopeComponents: [{ key: "billing-api", displayName: "Billing API", role: "primary" }],
          required: true,
          state: "pr_created",
          verification: "passed",
          review: "passed",
          pullRequest: { pullRequestId: "pr-214", status: "open", href: "/pull-requests/pr-214" },
          attentionSeverity: "none",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3",
        },
        {
          componentWorkKey: "cw-orion-4",
          title: "재시도 정책 문서화",
          primaryComponent: { key: "docs", displayName: "Docs" },
          executionScope: "single",
          scopeComponents: [{ key: "docs", displayName: "Docs", role: "primary" }],
          required: false,
          state: "queued",
          verification: "not_started",
          review: "not_started",
          pullRequest: null,
          attentionSeverity: "none",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-4",
        },
      ],
      requiredCount: 3,
      optionalCount: 1,
      omittedCount: 0,
    },
    componentContracts: {
      items: [
        {
          contractKey: "ct-1",
          title: "재시도 큐 레코드 스키마 계약",
          type: "data_schema",
          status: "changes_requested",
          required: true,
          producerComponent: "billing-worker",
          consumerComponent: "billing-api",
          href: "/projects/orion-billing/artifacts/contract-ct-1",
        },
      ],
      omittedCount: 0,
    },
    humanVerification: {
      state: "not_available",
      requiredItemCount: 0,
      passedRequiredItemCount: 0,
      failedRequiredItemCount: 0,
      href: null,
    },
    timeline: {
      items: [
        {
          eventKey: "tl-1",
          occurredAt: iso(0, 1),
          actorLabel: "system",
          kind: "incident",
          fromState: "active",
          toState: "blocked",
          summary: "정산 배치 3회 연속 실패로 사고가 개설되어 차단되었습니다",
          evidenceHref: "/projects/orion-billing/incidents/inc-501",
        },
        {
          eventKey: "tl-2",
          occurredAt: iso(0, 3),
          actorLabel: "codex-agent-3",
          kind: "review",
          fromState: null,
          toState: null,
          summary: "정산 API 멱등성 키 변경에 대해 변경 요청이 접수되었습니다",
          evidenceHref: "/reviews/rg-fu402-2",
        },
        {
          eventKey: "tl-3",
          occurredAt: iso(1, 0),
          actorLabel: "codex-agent-1",
          kind: "pull_request",
          fromState: null,
          toState: null,
          summary: "PR #214가 생성되었습니다",
          evidenceHref: "/pull-requests/pr-214",
        },
        {
          eventKey: "tl-4",
          occurredAt: iso(3, 0),
          actorLabel: "system",
          kind: "state_transition",
          fromState: "approved",
          toState: "active",
          summary: "승인된 Feature Unit이 실행 상태로 전환되었습니다",
          evidenceHref: null,
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot("rv-fu402-9"),
  },
  "fu-orion-501": {
    featureUnit: {
      featureUnitKey: "fu-orion-501",
      sequenceNumber: 1,
      title: "사기 탐지 규칙 v2",
      intent: "결제 패턴 기반 사기 탐지 규칙을 v2로 교체해 오탐률을 낮추고 실시간 스코어링과 연동한다.",
      state: "ready_for_human_review",
      riskLevel: "security_sensitive",
      constraintProfile: { version: 4, contentSha256: "a1c4e7b2", href: "/projects/orion-billing/artifacts/constraint-profile-4" },
      spec: {
        artifactKey: "spec-fu-orion-501",
        revision: 1,
        contentSha256: "3f8e0c5b",
        status: "valid",
        href: "/projects/orion-billing/artifacts/spec-fu-orion-501",
      },
      resourceVersion: "rv-fu501-2",
    },
    planningGate: {
      state: "human_decision_required",
      explanationCode: "awaiting_human_planning_approval",
      allowedActions: ["record_human_decision"],
      expectedResourceVersion: "rv-fu501-2",
    },
    activationGate: {
      state: "not_approved",
      unmetDependencyCount: 0,
      waivedDependencyCount: 0,
      pauseOrIncidentBlocking: false,
      explanationCode: "planning_not_yet_approved",
    },
    acceptanceCriteria: {
      items: [
        {
          criterionKey: "ac-1",
          description: "기존 규칙 대비 오탐률 20% 이상 감소를 시뮬레이션으로 증명한다",
          verificationMode: "artifact_review",
          required: true,
          status: "not_started",
          evidenceHref: null,
        },
        {
          criterionKey: "ac-2",
          description: "보안 민감 리스크에 대한 사람 검토를 통과한다",
          verificationMode: "human_check",
          required: true,
          status: "not_started",
          evidenceHref: null,
        },
      ],
      totalCount: 2,
      requiredCount: 2,
    },
    dependencies: {
      prerequisites: [],
      dependents: [
        {
          featureUnitKey: "fu-orion-502",
          title: "실시간 스코어링 API",
          relation: "depends_on",
          href: "/projects/orion-billing/roadmaps/rm-02/feature-units/fu-orion-502",
        },
      ],
    },
    componentWork: { items: [], requiredCount: 0, optionalCount: 0, omittedCount: 0 },
    componentContracts: { items: [], omittedCount: 0 },
    humanVerification: { state: "not_available", requiredItemCount: 0, passedRequiredItemCount: 0, failedRequiredItemCount: 0, href: null },
    timeline: {
      items: [
        {
          eventKey: "tl-1",
          occurredAt: iso(1, 12),
          actorLabel: "system",
          kind: "state_transition",
          fromState: "draft",
          toState: "ready_for_human_review",
          summary: "Spec 검토가 완료되어 사람 승인 대기 상태가 되었습니다",
          evidenceHref: "/projects/orion-billing/artifacts/spec-fu-orion-501",
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot("rv-fu501-2"),
  },
  "fu-orion-404": {
    featureUnit: {
      featureUnitKey: "fu-orion-404",
      sequenceNumber: 4,
      title: "정산 리포트 자동 발송",
      intent: "월별 정산 리포트를 지정된 수신자에게 자동으로 생성해 발송한다.",
      state: "human_verification_pending",
      riskLevel: "normal",
      constraintProfile: { version: 4, contentSha256: "a1c4e7b2", href: "/projects/orion-billing/artifacts/constraint-profile-4" },
      spec: {
        artifactKey: "spec-fu-orion-404",
        revision: 2,
        contentSha256: "5e0f9a3c",
        status: "valid",
        href: "/projects/orion-billing/artifacts/spec-fu-orion-404",
      },
      resourceVersion: "rv-fu404-6",
    },
    planningGate: {
      state: "approved",
      explanationCode: "already_approved",
      allowedActions: [],
      expectedResourceVersion: "rv-fu404-6",
    },
    activationGate: {
      state: "active",
      unmetDependencyCount: 0,
      waivedDependencyCount: 0,
      pauseOrIncidentBlocking: false,
      explanationCode: "no_blocking_condition",
    },
    acceptanceCriteria: {
      items: [
        {
          criterionKey: "ac-1",
          description: "월별 리포트가 매월 1일 오전 9시(KST)에 생성된다",
          verificationMode: "command",
          required: true,
          status: "passed",
          evidenceHref: "/verification-runs/vr-fu404-1",
        },
        {
          criterionKey: "ac-2",
          description: "리포트에는 정산 대사 결과가 포함된다",
          verificationMode: "artifact_review",
          required: true,
          status: "passed",
          evidenceHref: "/reviews/rg-fu404-1",
        },
      ],
      totalCount: 2,
      requiredCount: 2,
    },
    dependencies: { prerequisites: [], dependents: [] },
    componentWork: {
      items: [
        {
          componentWorkKey: "cw-orion-5",
          title: "리포트 생성 배치",
          primaryComponent: { key: "billing-worker", displayName: "Billing Worker" },
          executionScope: "single",
          scopeComponents: [{ key: "billing-worker", displayName: "Billing Worker", role: "primary" }],
          required: true,
          state: "pr_created",
          verification: "passed",
          review: "passed",
          pullRequest: { pullRequestId: "pr-198", status: "merged", href: "/pull-requests/pr-198" },
          attentionSeverity: "none",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-404/component-works/cw-orion-5",
        },
        {
          componentWorkKey: "cw-orion-6",
          title: "발송 알림 템플릿",
          primaryComponent: { key: "billing-api", displayName: "Billing API" },
          executionScope: "single",
          scopeComponents: [{ key: "billing-api", displayName: "Billing API", role: "primary" }],
          required: true,
          state: "pr_created",
          verification: "passed",
          review: "passed",
          pullRequest: { pullRequestId: "pr-199", status: "merged", href: "/pull-requests/pr-199" },
          attentionSeverity: "none",
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-404/component-works/cw-orion-6",
        },
      ],
      requiredCount: 2,
      optionalCount: 0,
      omittedCount: 0,
    },
    componentContracts: { items: [], omittedCount: 0 },
    humanVerification: {
      state: "pending",
      requiredItemCount: 3,
      passedRequiredItemCount: 1,
      failedRequiredItemCount: 0,
      href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-404/human-verification",
    },
    timeline: {
      items: [
        {
          eventKey: "fu404-tl-1",
          occurredAt: iso(2, 0),
          actorLabel: "system",
          kind: "state_transition",
          fromState: "ready_for_pr",
          toState: "human_verification_pending",
          summary: "필요한 Component Work가 모두 병합되어 사람 검증 대기 상태가 되었습니다",
          evidenceHref: null,
        },
        {
          eventKey: "fu404-tl-2",
          occurredAt: iso(3, 0),
          actorLabel: "codex-agent-2",
          kind: "pull_request",
          fromState: null,
          toState: null,
          summary: "PR #199가 병합되었습니다",
          evidenceHref: "/pull-requests/pr-199",
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot("rv-fu404-6"),
  },
};

interface FallbackSeed {
  featureUnitKey: string;
  projectKey: string;
  roadmapKey: string;
  sequenceNumber: number;
  title: string;
  state: string;
  riskLevel: FeatureUnitRiskLevel;
}

const FALLBACK_SEEDS: FallbackSeed[] = [
  { featureUnitKey: "fu-orion-401", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 1, title: "정산 배치 스케줄러", state: "closed", riskLevel: "normal" },
  { featureUnitKey: "fu-orion-403", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 3, title: "정산 실패 알림", state: "approved", riskLevel: "normal" },
  { featureUnitKey: "fu-orion-405", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 5, title: "환불 처리 자동화", state: "closed", riskLevel: "high" },
  { featureUnitKey: "fu-orion-406", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 6, title: "세금계산서 연동", state: "closed", riskLevel: "normal" },
  { featureUnitKey: "fu-orion-407", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 7, title: "정산 대사 리포트", state: "closed", riskLevel: "normal" },
  { featureUnitKey: "fu-orion-408", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 8, title: "결제 재시도 알림 UX", state: "ready_for_human_review", riskLevel: "normal" },
  { featureUnitKey: "fu-orion-409", projectKey: "orion-billing", roadmapKey: "rm-01", sequenceNumber: 9, title: "정산 데이터 아카이빙", state: "ready_for_human_review", riskLevel: "production_data_related" },
  { featureUnitKey: "fu-orion-502", projectKey: "orion-billing", roadmapKey: "rm-02", sequenceNumber: 2, title: "실시간 스코어링 API", state: "draft", riskLevel: "high" },
  { featureUnitKey: "fu-atlas-118", projectKey: "atlas-fulfillment", roadmapKey: "rm-01", sequenceNumber: 1, title: "배송 구역 재분배 엔진", state: "blocked", riskLevel: "high" },
  { featureUnitKey: "fu-nova-076", projectKey: "nova-support", roadmapKey: "rm-01", sequenceNumber: 1, title: "상담원 응답 초안 생성", state: "ready_for_human_review", riskLevel: "normal" },
  { featureUnitKey: "fu-helios-033", projectKey: "helios-payroll", roadmapKey: "rm-01", sequenceNumber: 1, title: "원천징수 세율 테이블 갱신", state: "review_running", riskLevel: "production_data_related" },
  { featureUnitKey: "fu-aster-201", projectKey: "aster-crm", roadmapKey: "rm-01", sequenceNumber: 1, title: "리드 스코어 재계산 파이프라인", state: "active", riskLevel: "normal" },
  { featureUnitKey: "fu-meridian-055", projectKey: "meridian-analytics", roadmapKey: "rm-01", sequenceNumber: 1, title: "이상 탐지 알림 규칙", state: "active", riskLevel: "normal" },
  { featureUnitKey: "fu-lyra-140", projectKey: "lyra-inventory", roadmapKey: "rm-01", sequenceNumber: 1, title: "재고 스냅샷 정합성 검증", state: "ready_for_human_review", riskLevel: "normal" },
  { featureUnitKey: "fu-pulsar-009", projectKey: "pulsar-search", roadmapKey: "rm-01", sequenceNumber: 1, title: "동의어 사전 재색인", state: "active", riskLevel: "normal" },
];

const PLANNING_GATE_BY_STATE: Record<string, FeatureUnitPlanningGateState> = {
  draft: "not_ready",
  ready_for_human_review: "human_decision_required",
  changes_requested: "changes_requested",
};

const ACTIVATION_GATE_BY_STATE: Record<string, FeatureUnitActivationGateState> = {
  blocked: "blocked",
  active: "active",
  implementation_done: "active",
  verification_running: "active",
  review_running: "active",
  needs_revision: "active",
  ready_for_pr: "active",
  pr_created: "active",
  human_verification_pending: "active",
  human_verified: "active",
  closed: "active",
};

function buildFallbackDetail(seed: FallbackSeed): FeatureUnitDetailResponse {
  const planningGateState = PLANNING_GATE_BY_STATE[seed.state] ?? "approved";
  const activationGateState = ACTIVATION_GATE_BY_STATE[seed.state] ?? "eligible";
  const canDecide = planningGateState === "human_decision_required";
  const rv = `rv-${seed.featureUnitKey}-fallback`;

  return {
    featureUnit: {
      featureUnitKey: seed.featureUnitKey,
      sequenceNumber: seed.sequenceNumber,
      title: seed.title,
      intent: `${seed.title} 기능을 계획된 범위 안에서 구현하고 검증한다.`,
      state: seed.state,
      riskLevel: seed.riskLevel,
      constraintProfile: { version: 1, contentSha256: "fallback0000", href: `/projects/${seed.projectKey}/artifacts/constraint-profile-1` },
      spec: {
        artifactKey: `spec-${seed.featureUnitKey}`,
        revision: 1,
        contentSha256: "fallback0000",
        status: "valid",
        href: `/projects/${seed.projectKey}/artifacts/spec-${seed.featureUnitKey}`,
      },
      resourceVersion: rv,
    },
    planningGate: {
      state: planningGateState,
      explanationCode:
        planningGateState === "human_decision_required"
          ? "awaiting_human_planning_approval"
          : planningGateState === "not_ready"
            ? "spec_not_yet_ready"
            : "not_applicable_for_current_state",
      allowedActions: canDecide ? ["record_human_decision"] : [],
      expectedResourceVersion: rv,
    },
    activationGate: {
      state: activationGateState,
      unmetDependencyCount: 0,
      waivedDependencyCount: 0,
      pauseOrIncidentBlocking: seed.state === "blocked",
      explanationCode: seed.state === "blocked" ? "blocked_by_open_incident" : "no_blocking_condition",
    },
    acceptanceCriteria: { items: [], totalCount: 0, requiredCount: 0 },
    dependencies: { prerequisites: [], dependents: [] },
    componentWork: { items: [], requiredCount: 0, optionalCount: 0, omittedCount: 0 },
    componentContracts: { items: [], omittedCount: 0 },
    humanVerification: { state: "not_available", requiredItemCount: 0, passedRequiredItemCount: 0, failedRequiredItemCount: 0, href: null },
    timeline: {
      items: [
        {
          eventKey: `${seed.featureUnitKey}-tl-1`,
          occurredAt: iso(1),
          actorLabel: "system",
          kind: "state_transition",
          fromState: null,
          toState: seed.state,
          summary: `현재 상태(${seed.state})로 전이되었습니다`,
          evidenceHref: null,
        },
      ],
      omittedCount: 0,
    },
    snapshot: snapshot(rv),
  };
}

export function getFeatureUnitDetail(
  projectKey: string,
  roadmapKey: string,
  featureUnitKey: string,
): FeatureUnitDetailResponse | null {
  const rich = RICH[featureUnitKey];
  const richScope = RICH_SCOPE[featureUnitKey];
  if (rich && richScope && richScope.projectKey === projectKey && richScope.roadmapKey === roadmapKey) {
    return rich;
  }

  const seed = FALLBACK_SEEDS.find(
    (s) => s.featureUnitKey === featureUnitKey && s.projectKey === projectKey && s.roadmapKey === roadmapKey,
  );
  return seed ? buildFallbackDetail(seed) : null;
}
