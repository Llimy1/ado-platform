import type {
  RoadmapDetailResponse,
  RoadmapListItem,
  RoadmapListQuery,
  RoadmapListResponse,
  RoadmapState,
} from "@/lib/contracts/roadmaps";

/**
 * In-memory mock read model standing in for the Roadmap projections
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-03.2. Prototype-only data;
 * no database or Spring service is involved.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

function href(projectKey: string, roadmapKey: string, featureUnitKey?: string): string {
  const base = `/projects/${projectKey}/roadmaps/${roadmapKey}`;
  return featureUnitKey ? `${base}/feature-units/${featureUnitKey}` : base;
}

interface ProjectRoadmapSeed {
  projectKey: string;
  roadmaps: RoadmapListItem[];
}

const SEEDS: ProjectRoadmapSeed[] = [
  {
    projectKey: "orion-billing",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "2026 Q3 정산 안정화",
        state: "active",
        source: { version: "v3", importedAt: iso(45), contentSha256: "8f3a1c9e2b5d7f10" },
        featureUnitSummary: { total: 9, approved: 0, active: 2, blocked: 1, closed: 4 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(0, 1),
        href: href("orion-billing", "rm-01"),
      },
      {
        roadmapKey: "rm-02",
        title: "2026 Q4 사기 탐지 확장",
        state: "review_ready",
        source: { version: "v1", importedAt: iso(2), contentSha256: "1b7e4d8a0f2c6931" },
        featureUnitSummary: { total: 5, approved: 0, active: 0, blocked: 0, closed: 0 },
        pendingPlanningDecision: true,
        lastCommittedEventAt: iso(1, 3),
        href: href("orion-billing", "rm-02"),
      },
    ],
  },
  {
    projectKey: "atlas-fulfillment",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "물류 자동화 로드맵",
        state: "blocked",
        source: { version: "v2", importedAt: iso(60), contentSha256: "2d9c5e1a7b4f8032" },
        featureUnitSummary: { total: 6, approved: 0, active: 0, blocked: 3, closed: 2 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(0, 4),
        href: href("atlas-fulfillment", "rm-01"),
      },
    ],
  },
  {
    projectKey: "nova-support",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "AI 상담 지원 로드맵",
        state: "active",
        source: { version: "v4", importedAt: iso(70), contentSha256: "5a8f2d0c9e3b6714" },
        featureUnitSummary: { total: 5, approved: 1, active: 1, blocked: 0, closed: 2 },
        pendingPlanningDecision: true,
        lastCommittedEventAt: iso(0, 6),
        href: href("nova-support", "rm-01"),
      },
    ],
  },
  {
    projectKey: "helios-payroll",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "글로벌 급여 자동화",
        state: "active",
        source: { version: "v2", importedAt: iso(50), contentSha256: "9c1e6b4a2f7d0853" },
        featureUnitSummary: { total: 4, approved: 0, active: 1, blocked: 0, closed: 2 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(1, 2),
        href: href("helios-payroll", "rm-01"),
      },
    ],
  },
  {
    projectKey: "aster-crm",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "영업 파이프라인 고도화",
        state: "active",
        source: { version: "v5", importedAt: iso(90), contentSha256: "3e7a9c2d5f1b8460" },
        featureUnitSummary: { total: 7, approved: 0, active: 3, blocked: 0, closed: 3 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(0, 2),
        href: href("aster-crm", "rm-01"),
      },
    ],
  },
  {
    projectKey: "meridian-analytics",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "실시간 분석 확장",
        state: "active",
        source: { version: "v3", importedAt: iso(40), contentSha256: "6b2f8d1a4c9e0537" },
        featureUnitSummary: { total: 4, approved: 0, active: 1, blocked: 0, closed: 2 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(2, 5),
        href: href("meridian-analytics", "rm-01"),
      },
    ],
  },
  {
    projectKey: "lyra-inventory",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "재고 동기화 안정화",
        state: "active",
        source: { version: "v2", importedAt: iso(35), contentSha256: "4f0c8e2b6a1d9375" },
        featureUnitSummary: { total: 5, approved: 1, active: 1, blocked: 1, closed: 1 },
        pendingPlanningDecision: true,
        lastCommittedEventAt: iso(0, 9),
        href: href("lyra-inventory", "rm-01"),
      },
    ],
  },
  {
    projectKey: "pulsar-search",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "검색 랭킹 개선",
        state: "active",
        source: { version: "v6", importedAt: iso(120), contentSha256: "7d3b9f1e5a2c6048" },
        featureUnitSummary: { total: 6, approved: 0, active: 1, blocked: 0, closed: 4 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(3, 1),
        href: href("pulsar-search", "rm-01"),
      },
    ],
  },
  {
    projectKey: "vega-onboarding",
    roadmaps: [
      {
        roadmapKey: "rm-01",
        title: "온보딩 자동화",
        state: "completed",
        source: { version: "v2", importedAt: iso(200), contentSha256: "0a4c7e9b3d1f8526" },
        featureUnitSummary: { total: 6, approved: 0, active: 0, blocked: 0, closed: 6 },
        pendingPlanningDecision: false,
        lastCommittedEventAt: iso(6, 0),
        href: href("vega-onboarding", "rm-01"),
      },
    ],
  },
  { projectKey: "quasar-legacy", roadmaps: [] },
];

function seedFor(projectKey: string): ProjectRoadmapSeed | undefined {
  return SEEDS.find((s) => s.projectKey === projectKey);
}

export function listRoadmaps(projectKey: string, query: RoadmapListQuery): RoadmapListResponse {
  const seed = seedFor(projectKey);
  let items = seed ? [...seed.roadmaps] : [];

  if (query.state) items = items.filter((r) => r.state === query.state);

  const sort = query.sort ?? "activity";
  items.sort((a, b) => {
    if (sort === "name") return a.title.localeCompare(b.title, "ko");
    if (sort === "sequence") return a.roadmapKey.localeCompare(b.roadmapKey);
    return Date.parse(b.lastCommittedEventAt) - Date.parse(a.lastCommittedEventAt);
  });

  return {
    items,
    page: { limit: query.limit ?? 25, nextCursor: null, hasMore: false },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  };
}

export function isValidRoadmapState(value: string): value is RoadmapState {
  return [
    "draft",
    "analyzed",
    "review_ready",
    "approved",
    "active",
    "completed",
    "archived",
    "blocked",
    "cancelled",
    "incident_hold",
  ].includes(value);
}

const DETAIL_BY_KEY: Record<string, RoadmapDetailResponse> = {
  "orion-billing/rm-01": {
    roadmap: {
      roadmapKey: "rm-01",
      title: "2026 Q3 정산 안정화",
      summary: "정산 배치 신뢰성 확보와 결제 재시도 정책 정비를 통해 정산 실패율을 낮춘다.",
      state: "active",
      source: {
        artifactKey: "artifact-rm-01",
        sourceKind: "markdown_document",
        sourceVersion: "v3",
        contentSha256: "8f3a1c9e2b5d7f10",
        importedAt: iso(45),
        renderedDocumentHref: "/projects/orion-billing/artifacts/artifact-rm-01",
      },
      analyzedAt: iso(44),
      approvedAt: iso(40),
      resourceVersion: "rv-rm01-12",
    },
    planningGate: {
      state: "approved",
      explanationCode: "already_approved_active",
      allowedActions: [],
      decisionRequirements: {
        canApprove: false,
        canRequestChanges: false,
        changeRequestReasonRequired: true,
        expectedResourceVersion: "rv-rm01-12",
      },
    },
    featureUnits: {
      items: [
        {
          featureUnitKey: "fu-orion-401",
          sequenceNumber: 1,
          title: "정산 배치 스케줄러",
          state: "closed",
          riskLevel: "normal",
          dependency: { requiredPrerequisiteCount: 0, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 1 },
          componentWork: { requiredCount: 3, openCount: 0, blockedCount: 0, prCreatedCount: 3 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-401"),
        },
        {
          featureUnitKey: "fu-orion-402",
          sequenceNumber: 2,
          title: "정산 배치 재시도 정책",
          state: "blocked",
          riskLevel: "high",
          dependency: { requiredPrerequisiteCount: 1, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 1 },
          componentWork: { requiredCount: 4, openCount: 3, blockedCount: 2, prCreatedCount: 1 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-402"),
        },
        {
          featureUnitKey: "fu-orion-403",
          sequenceNumber: 3,
          title: "정산 실패 알림",
          state: "approved",
          riskLevel: "normal",
          dependency: { requiredPrerequisiteCount: 1, unsatisfiedPrerequisiteCount: 1, blockingDependentCount: 0 },
          componentWork: { requiredCount: 2, openCount: 2, blockedCount: 0, prCreatedCount: 0 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-403"),
        },
        {
          featureUnitKey: "fu-orion-404",
          sequenceNumber: 4,
          title: "정산 리포트 자동 발송",
          state: "human_verification_pending",
          riskLevel: "normal",
          dependency: { requiredPrerequisiteCount: 0, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 0 },
          componentWork: { requiredCount: 2, openCount: 0, blockedCount: 0, prCreatedCount: 2 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-404"),
        },
        {
          featureUnitKey: "fu-orion-405",
          sequenceNumber: 5,
          title: "환불 처리 자동화",
          state: "closed",
          riskLevel: "high",
          dependency: { requiredPrerequisiteCount: 0, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 0 },
          componentWork: { requiredCount: 3, openCount: 0, blockedCount: 0, prCreatedCount: 3 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-405"),
        },
        {
          featureUnitKey: "fu-orion-406",
          sequenceNumber: 6,
          title: "세금계산서 연동",
          state: "closed",
          riskLevel: "normal",
          dependency: { requiredPrerequisiteCount: 0, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 0 },
          componentWork: { requiredCount: 2, openCount: 0, blockedCount: 0, prCreatedCount: 2 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-406"),
        },
        {
          featureUnitKey: "fu-orion-407",
          sequenceNumber: 7,
          title: "정산 대사 리포트",
          state: "closed",
          riskLevel: "normal",
          dependency: { requiredPrerequisiteCount: 0, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 0 },
          componentWork: { requiredCount: 2, openCount: 0, blockedCount: 0, prCreatedCount: 2 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-01", "fu-orion-407"),
        },
        {
          featureUnitKey: "fu-orion-408",
          sequenceNumber: 8,
          title: "결제 재시도 알림 UX",
          state: "ready_for_human_review",
          riskLevel: "normal",
          dependency: { requiredPrerequisiteCount: 1, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 0 },
          componentWork: { requiredCount: 1, openCount: 1, blockedCount: 0, prCreatedCount: 0 },
          pendingHumanDecisionCount: 1,
          href: href("orion-billing", "rm-01", "fu-orion-408"),
        },
        {
          featureUnitKey: "fu-orion-409",
          sequenceNumber: 9,
          title: "정산 데이터 아카이빙",
          state: "ready_for_human_review",
          riskLevel: "production_data_related",
          dependency: { requiredPrerequisiteCount: 1, unsatisfiedPrerequisiteCount: 1, blockingDependentCount: 0 },
          componentWork: { requiredCount: 2, openCount: 2, blockedCount: 0, prCreatedCount: 0 },
          pendingHumanDecisionCount: 1,
          href: href("orion-billing", "rm-01", "fu-orion-409"),
        },
      ],
      totalCount: 9,
      omittedCount: 0,
    },
    dependencyMap: {
      isTruncated: false,
      omittedNodeCount: 0,
      nodes: [
        { featureUnitKey: "fu-orion-401", title: "정산 배치 스케줄러", state: "closed", href: href("orion-billing", "rm-01", "fu-orion-401") },
        { featureUnitKey: "fu-orion-402", title: "정산 배치 재시도 정책", state: "blocked", href: href("orion-billing", "rm-01", "fu-orion-402") },
        { featureUnitKey: "fu-orion-403", title: "정산 실패 알림", state: "approved", href: href("orion-billing", "rm-01", "fu-orion-403") },
        { featureUnitKey: "fu-orion-408", title: "결제 재시도 알림 UX", state: "ready_for_human_review", href: href("orion-billing", "rm-01", "fu-orion-408") },
      ],
      edges: [
        { fromFeatureUnitKey: "fu-orion-401", toFeatureUnitKey: "fu-orion-402", relation: "depends_on" },
        { fromFeatureUnitKey: "fu-orion-402", toFeatureUnitKey: "fu-orion-403", relation: "depends_on" },
        { fromFeatureUnitKey: "fu-orion-402", toFeatureUnitKey: "fu-orion-408", relation: "depends_on" },
      ],
      accessibleRows: [
        { featureUnitKey: "fu-orion-401", dependsOn: [], blocks: ["fu-orion-402"] },
        { featureUnitKey: "fu-orion-402", dependsOn: ["fu-orion-401"], blocks: ["fu-orion-403", "fu-orion-408"] },
        { featureUnitKey: "fu-orion-403", dependsOn: ["fu-orion-402"], blocks: [] },
        { featureUnitKey: "fu-orion-408", dependsOn: ["fu-orion-402"], blocks: [] },
      ],
    },
    recentPlanningActivity: {
      items: [
        {
          eventKey: "rpa-1",
          occurredAt: iso(40),
          actorLabel: "Human Owner",
          summary: "로드맵이 승인되어 실행 단계로 전환되었습니다",
          evidenceHref: "/projects/orion-billing/decisions/dec-rm01-approve",
        },
        {
          eventKey: "rpa-2",
          occurredAt: iso(44),
          actorLabel: "system",
          summary: "로드맵 분석이 완료되어 검토 준비 상태가 되었습니다",
          evidenceHref: "/projects/orion-billing/artifacts/artifact-rm-01",
        },
        {
          eventKey: "rpa-3",
          occurredAt: iso(45),
          actorLabel: "Human Owner",
          summary: "소스 문서가 가져와졌습니다 (v3)",
          evidenceHref: null,
        },
      ],
      omittedCount: 0,
    },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-rm01-12" },
  },
  "orion-billing/rm-02": {
    roadmap: {
      roadmapKey: "rm-02",
      title: "2026 Q4 사기 탐지 확장",
      summary: "실시간 스코어링 API와 새로운 사기 탐지 규칙 세트를 도입해 이상 거래 대응 시간을 줄인다.",
      state: "review_ready",
      source: {
        artifactKey: "artifact-rm-02",
        sourceKind: "markdown_document",
        sourceVersion: "v1",
        contentSha256: "1b7e4d8a0f2c6931",
        importedAt: iso(2),
        renderedDocumentHref: "/projects/orion-billing/artifacts/artifact-rm-02",
      },
      analyzedAt: iso(1, 12),
      approvedAt: null,
      resourceVersion: "rv-rm02-3",
    },
    planningGate: {
      state: "human_decision_required",
      explanationCode: "awaiting_human_planning_approval",
      allowedActions: ["record_human_decision"],
      decisionRequirements: {
        canApprove: true,
        canRequestChanges: true,
        changeRequestReasonRequired: true,
        expectedResourceVersion: "rv-rm02-3",
      },
    },
    featureUnits: {
      items: [
        {
          featureUnitKey: "fu-orion-501",
          sequenceNumber: 1,
          title: "사기 탐지 규칙 v2",
          state: "ready_for_human_review",
          riskLevel: "security_sensitive",
          dependency: { requiredPrerequisiteCount: 0, unsatisfiedPrerequisiteCount: 0, blockingDependentCount: 1 },
          componentWork: { requiredCount: 0, openCount: 0, blockedCount: 0, prCreatedCount: 0 },
          pendingHumanDecisionCount: 1,
          href: href("orion-billing", "rm-02", "fu-orion-501"),
        },
        {
          featureUnitKey: "fu-orion-502",
          sequenceNumber: 2,
          title: "실시간 스코어링 API",
          state: "draft",
          riskLevel: "high",
          dependency: { requiredPrerequisiteCount: 1, unsatisfiedPrerequisiteCount: 1, blockingDependentCount: 0 },
          componentWork: { requiredCount: 0, openCount: 0, blockedCount: 0, prCreatedCount: 0 },
          pendingHumanDecisionCount: 0,
          href: href("orion-billing", "rm-02", "fu-orion-502"),
        },
      ],
      totalCount: 5,
      omittedCount: 3,
    },
    dependencyMap: {
      isTruncated: true,
      omittedNodeCount: 3,
      nodes: [
        { featureUnitKey: "fu-orion-501", title: "사기 탐지 규칙 v2", state: "ready_for_human_review", href: href("orion-billing", "rm-02", "fu-orion-501") },
        { featureUnitKey: "fu-orion-502", title: "실시간 스코어링 API", state: "draft", href: href("orion-billing", "rm-02", "fu-orion-502") },
      ],
      edges: [{ fromFeatureUnitKey: "fu-orion-501", toFeatureUnitKey: "fu-orion-502", relation: "depends_on" }],
      accessibleRows: [
        { featureUnitKey: "fu-orion-501", dependsOn: [], blocks: ["fu-orion-502"] },
        { featureUnitKey: "fu-orion-502", dependsOn: ["fu-orion-501"], blocks: [] },
      ],
    },
    recentPlanningActivity: {
      items: [
        {
          eventKey: "rpa-4",
          occurredAt: iso(1, 12),
          actorLabel: "system",
          summary: "로드맵 분석이 완료되어 검토 준비 상태가 되었습니다 (8개 Feature Unit, 차단 사이클 0건)",
          evidenceHref: "/projects/orion-billing/artifacts/artifact-rm-02",
        },
        {
          eventKey: "rpa-5",
          occurredAt: iso(2),
          actorLabel: "Human Owner",
          summary: "소스 문서가 가져와졌습니다 (v1)",
          evidenceHref: null,
        },
      ],
      omittedCount: 0,
    },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-rm02-3" },
  },
};

function buildFallbackDetail(projectKey: string, item: RoadmapListItem): RoadmapDetailResponse {
  const gateStateByRoadmapState: Record<RoadmapState, RoadmapDetailResponse["planningGate"]["state"]> = {
    draft: "analysis_required",
    analyzed: "human_decision_required",
    review_ready: "human_decision_required",
    approved: "approved",
    active: "approved",
    completed: "approved",
    archived: "approved",
    blocked: "blocked",
    cancelled: "blocked",
    incident_hold: "blocked",
  };
  const canDecide = item.state === "review_ready" || item.state === "analyzed";

  return {
    roadmap: {
      roadmapKey: item.roadmapKey,
      title: item.title,
      summary: `${item.title}의 실행 계획 문서입니다.`,
      state: item.state,
      source: {
        artifactKey: `artifact-${item.roadmapKey}`,
        sourceKind: "markdown_document",
        sourceVersion: item.source.version,
        contentSha256: item.source.contentSha256,
        importedAt: item.source.importedAt,
        renderedDocumentHref: `/projects/${projectKey}/artifacts/artifact-${item.roadmapKey}`,
      },
      analyzedAt: item.source.importedAt,
      approvedAt: item.state === "active" || item.state === "approved" || item.state === "completed" ? item.source.importedAt : null,
      resourceVersion: `rv-${item.roadmapKey}-fallback`,
    },
    planningGate: {
      state: gateStateByRoadmapState[item.state],
      explanationCode: canDecide ? "awaiting_human_planning_approval" : "not_applicable_for_current_state",
      allowedActions: canDecide ? ["record_human_decision"] : [],
      decisionRequirements: {
        canApprove: canDecide,
        canRequestChanges: canDecide,
        changeRequestReasonRequired: true,
        expectedResourceVersion: `rv-${item.roadmapKey}-fallback`,
      },
    },
    featureUnits: { items: [], totalCount: item.featureUnitSummary.total, omittedCount: item.featureUnitSummary.total },
    dependencyMap: { isTruncated: false, omittedNodeCount: 0, nodes: [], edges: [], accessibleRows: [] },
    recentPlanningActivity: { items: [], omittedCount: 0 },
    snapshot: {
      observedAt: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      resourceVersion: `rv-${item.roadmapKey}-fallback`,
    },
  };
}

export function getRoadmapDetail(projectKey: string, roadmapKey: string): RoadmapDetailResponse | null {
  const rich = DETAIL_BY_KEY[`${projectKey}/${roadmapKey}`];
  if (rich) return rich;

  const seed = seedFor(projectKey);
  const item = seed?.roadmaps.find((r) => r.roadmapKey === roadmapKey);
  return item ? buildFallbackDetail(projectKey, item) : null;
}
