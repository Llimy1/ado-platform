import type {
  ProjectAttentionFilter,
  ProjectListItem,
  ProjectListQuery,
  ProjectListResponse,
  ProjectSort,
  SortDirection,
} from "@/lib/contracts/projects";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

/**
 * In-memory mock read model standing in for the PostgreSQL-backed
 * ProjectListProjection described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-01.2.
 * This is prototype-only data; no database, no Java/Spring service, and no
 * real network boundary is implied by this module.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

const RAW_PROJECTS: ProjectListItem[] = [
  {
    projectKey: "orion-billing",
    name: "Orion 결제 플랫폼",
    description: "정기 결제 및 인보이스 자동화",
    lifecycle: "active",
    operationalStatus: "incident_hold",
    attention: {
      severity: "critical",
      reasons: ["open_incident", "blocked_component_work"],
      humanDecisionCount: 1,
      blockedCount: 2,
      failedCount: 1,
      incidentCount: 1,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-orion-402",
      title: "정산 배치 재시도 정책",
      state: "blocked",
    },
    componentWork: { activeCount: 1, openCount: 4 },
    lastCommittedEventAt: iso(0, 1),
    resourceVersion: "rv-8821",
    links: {
      self: "/projects/orion-billing",
      overview: "/projects/orion-billing",
      activeFeatureUnit: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402",
    },
  },
  {
    projectKey: "atlas-fulfillment",
    name: "Atlas 풀필먼트",
    description: "창고 배차 및 배송 SLA 관리",
    lifecycle: "active",
    operationalStatus: "blocked",
    attention: {
      severity: "critical",
      reasons: ["blocked_feature_unit", "verification_failed"],
      humanDecisionCount: 0,
      blockedCount: 3,
      failedCount: 2,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-atlas-118",
      title: "배송 구역 재분배 엔진",
      state: "blocked",
    },
    componentWork: { activeCount: 0, openCount: 5 },
    lastCommittedEventAt: iso(0, 4),
    resourceVersion: "rv-4410",
    links: {
      self: "/projects/atlas-fulfillment",
      overview: "/projects/atlas-fulfillment",
      activeFeatureUnit: "/projects/atlas-fulfillment/roadmaps/rm-01/feature-units/fu-atlas-118",
    },
  },
  {
    projectKey: "nova-support",
    name: "Nova 고객 지원 콘솔",
    description: "상담원용 티켓 통합 뷰",
    lifecycle: "active",
    operationalStatus: "attention_required",
    attention: {
      severity: "warning",
      reasons: ["human_decision_required"],
      humanDecisionCount: 2,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-nova-076",
      title: "상담원 응답 초안 생성",
      state: "ready_for_human_review",
    },
    componentWork: { activeCount: 2, openCount: 3 },
    lastCommittedEventAt: iso(0, 6),
    resourceVersion: "rv-2290",
    links: {
      self: "/projects/nova-support",
      overview: "/projects/nova-support",
      activeFeatureUnit: "/projects/nova-support/roadmaps/rm-01/feature-units/fu-nova-076",
    },
  },
  {
    projectKey: "helios-payroll",
    name: "Helios 급여 관리",
    description: "다국가 급여 계산 및 명세서 발급",
    lifecycle: "active",
    operationalStatus: "attention_required",
    attention: {
      severity: "warning",
      reasons: ["accepted_review_finding"],
      humanDecisionCount: 0,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-helios-033",
      title: "원천징수 세율 테이블 갱신",
      state: "in_review",
    },
    componentWork: { activeCount: 1, openCount: 2 },
    lastCommittedEventAt: iso(1, 2),
    resourceVersion: "rv-1187",
    links: {
      self: "/projects/helios-payroll",
      overview: "/projects/helios-payroll",
      activeFeatureUnit: "/projects/helios-payroll/roadmaps/rm-01/feature-units/fu-helios-033",
    },
  },
  {
    projectKey: "aster-crm",
    name: "Aster 영업 CRM",
    description: "파이프라인 및 리드 스코어링",
    lifecycle: "active",
    operationalStatus: "healthy",
    attention: {
      severity: "none",
      reasons: [],
      humanDecisionCount: 0,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-aster-201",
      title: "리드 스코어 재계산 파이프라인",
      state: "running",
    },
    componentWork: { activeCount: 3, openCount: 3 },
    lastCommittedEventAt: iso(0, 2),
    resourceVersion: "rv-9931",
    links: {
      self: "/projects/aster-crm",
      overview: "/projects/aster-crm",
      activeFeatureUnit: "/projects/aster-crm/roadmaps/rm-01/feature-units/fu-aster-201",
    },
  },
  {
    projectKey: "meridian-analytics",
    name: "Meridian 분석 플랫폼",
    description: "실시간 대시보드 및 알림",
    lifecycle: "active",
    operationalStatus: "healthy",
    attention: {
      severity: "none",
      reasons: [],
      humanDecisionCount: 0,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-meridian-055",
      title: "이상 탐지 알림 규칙",
      state: "running",
    },
    componentWork: { activeCount: 1, openCount: 1 },
    lastCommittedEventAt: iso(2, 5),
    resourceVersion: "rv-7742",
    links: {
      self: "/projects/meridian-analytics",
      overview: "/projects/meridian-analytics",
      activeFeatureUnit: "/projects/meridian-analytics/roadmaps/rm-01/feature-units/fu-meridian-055",
    },
  },
  {
    projectKey: "vega-onboarding",
    name: "Vega 온보딩",
    description: "신규 가입자 KYC 플로우",
    lifecycle: "active",
    operationalStatus: "healthy",
    attention: {
      severity: "none",
      reasons: [],
      humanDecisionCount: 0,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: null,
    componentWork: { activeCount: 0, openCount: 0 },
    lastCommittedEventAt: iso(6, 0),
    resourceVersion: "rv-0110",
    links: {
      self: "/projects/vega-onboarding",
      overview: "/projects/vega-onboarding",
    },
  },
  {
    projectKey: "lyra-inventory",
    name: "Lyra 재고 관리",
    description: "다채널 재고 동기화",
    lifecycle: "active",
    operationalStatus: "attention_required",
    attention: {
      severity: "warning",
      reasons: ["human_decision_required", "blocked_component_work"],
      humanDecisionCount: 1,
      blockedCount: 1,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-lyra-140",
      title: "재고 스냅샷 정합성 검증",
      state: "ready_for_human_review",
    },
    componentWork: { activeCount: 1, openCount: 2 },
    lastCommittedEventAt: iso(0, 9),
    resourceVersion: "rv-3345",
    links: {
      self: "/projects/lyra-inventory",
      overview: "/projects/lyra-inventory",
      activeFeatureUnit: "/projects/lyra-inventory/roadmaps/rm-01/feature-units/fu-lyra-140",
    },
  },
  {
    projectKey: "pulsar-search",
    name: "Pulsar 검색 인프라",
    description: "상품 검색 랭킹 서비스",
    lifecycle: "active",
    operationalStatus: "healthy",
    attention: {
      severity: "none",
      reasons: [],
      humanDecisionCount: 0,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: {
      featureUnitKey: "fu-pulsar-009",
      title: "동의어 사전 재색인",
      state: "running",
    },
    componentWork: { activeCount: 1, openCount: 1 },
    lastCommittedEventAt: iso(3, 1),
    resourceVersion: "rv-5502",
    links: {
      self: "/projects/pulsar-search",
      overview: "/projects/pulsar-search",
      activeFeatureUnit: "/projects/pulsar-search/roadmaps/rm-01/feature-units/fu-pulsar-009",
    },
  },
  {
    projectKey: "quasar-legacy",
    name: "Quasar 레거시 마이그레이션",
    description: null,
    lifecycle: "archived",
    operationalStatus: "archived",
    attention: {
      severity: "none",
      reasons: [],
      humanDecisionCount: 0,
      blockedCount: 0,
      failedCount: 0,
      incidentCount: 0,
    },
    activeFeatureUnit: null,
    componentWork: { activeCount: 0, openCount: 0 },
    lastCommittedEventAt: iso(120, 0),
    resourceVersion: "rv-0001",
    links: {
      self: "/projects/quasar-legacy",
      overview: "/projects/quasar-legacy",
    },
  },
];

function matchesQuery(item: ProjectListItem, q: string): boolean {
  const needle = q.toLowerCase();
  return (
    item.name.toLowerCase().includes(needle) ||
    item.projectKey.toLowerCase().includes(needle) ||
    (item.description ?? "").toLowerCase().includes(needle)
  );
}

function attentionMatchesFilter(
  item: ProjectListItem,
  filters: ProjectAttentionFilter[],
): boolean {
  if (filters.length === 0) return true;
  return filters.some((f) => {
    if (f === "action_required") return item.operationalStatus === "attention_required";
    if (f === "blocked") return item.operationalStatus === "blocked";
    if (f === "incident_hold") return item.operationalStatus === "incident_hold";
    return false;
  });
}

const STATUS_RANK: Record<ProjectListItem["operationalStatus"], number> = {
  archived: 0,
  incident_hold: 4,
  blocked: 3,
  attention_required: 2,
  healthy: 1,
};

function compareBySort(
  a: ProjectListItem,
  b: ProjectListItem,
  sort: ProjectSort,
  direction: SortDirection,
): number {
  let cmp = 0;
  if (sort === "attention") {
    cmp = STATUS_RANK[a.operationalStatus] - STATUS_RANK[b.operationalStatus];
  } else if (sort === "activity") {
    cmp = Date.parse(a.lastCommittedEventAt) - Date.parse(b.lastCommittedEventAt);
  } else {
    cmp = a.name.localeCompare(b.name, "ko");
  }
  if (cmp === 0) cmp = a.projectKey.localeCompare(b.projectKey);
  return direction === "asc" ? cmp : -cmp;
}

export interface QueryValidationError {
  code: string;
  message: string;
}

const VALID_SORT: ProjectSort[] = ["attention", "activity", "name"];
const VALID_DIRECTION: SortDirection[] = ["asc", "desc"];
const VALID_ATTENTION: ProjectAttentionFilter[] = [
  "action_required",
  "blocked",
  "incident_hold",
];

export function validateProjectListQuery(
  params: URLSearchParams,
): { query: ProjectListQuery } | { error: QueryValidationError } {
  const q = params.get("q")?.trim() || undefined;
  if (q && (q.length < 1 || q.length > 120)) {
    return { error: { code: "invalid_query", message: "q must be 1-120 characters" } };
  }

  const archivedRaw = params.get("archived");
  let archived: boolean | undefined;
  if (archivedRaw !== null) {
    if (archivedRaw !== "true" && archivedRaw !== "false") {
      return { error: { code: "invalid_archived", message: "archived must be true or false" } };
    }
    archived = archivedRaw === "true";
  }

  const attentionRaw = params.getAll("attention");
  for (const a of attentionRaw) {
    if (!VALID_ATTENTION.includes(a as ProjectAttentionFilter)) {
      return { error: { code: "invalid_attention", message: `unsupported attention value: ${a}` } };
    }
  }

  const sortRaw = params.get("sort") ?? "attention";
  if (!VALID_SORT.includes(sortRaw as ProjectSort)) {
    return { error: { code: "invalid_sort", message: `unsupported sort value: ${sortRaw}` } };
  }

  const directionRaw = params.get("direction") ?? (sortRaw === "name" ? "asc" : "desc");
  if (!VALID_DIRECTION.includes(directionRaw as SortDirection)) {
    return { error: { code: "invalid_direction", message: `unsupported direction value: ${directionRaw}` } };
  }

  const limitRaw = params.get("limit");
  let limit = 25;
  if (limitRaw !== null) {
    const parsed = Number(limitRaw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
      return { error: { code: "invalid_limit", message: "limit must be an integer 1-100" } };
    }
    limit = parsed;
  }

  const cursorRaw = params.get("cursor") ?? undefined;
  let cursorOffset = 0;
  if (cursorRaw) {
    const decoded = Number(Buffer.from(cursorRaw, "base64").toString("utf-8"));
    if (!Number.isInteger(decoded) || decoded < 0) {
      return { error: { code: "invalid_cursor", message: "malformed cursor" } };
    }
    cursorOffset = decoded;
  }

  return {
    query: {
      q,
      archived,
      attention: attentionRaw as ProjectAttentionFilter[],
      sort: sortRaw as ProjectSort,
      direction: directionRaw as SortDirection,
      cursor: cursorOffset ? String(cursorOffset) : undefined,
      limit,
    },
  };
}

export function queryProjects(query: ProjectListQuery): ProjectListResponse {
  const archived = query.archived ?? false;
  let items = RAW_PROJECTS.filter((p) => (archived ? p.lifecycle === "archived" : p.lifecycle === "active"));

  if (query.q) items = items.filter((p) => matchesQuery(p, query.q!));
  if (query.attention?.length) items = items.filter((p) => attentionMatchesFilter(p, query.attention!));

  const sort = query.sort ?? "attention";
  const direction = query.direction ?? (sort === "name" ? "asc" : "desc");
  items = [...items].sort((a, b) => compareBySort(a, b, sort, direction));

  const limit = query.limit ?? 25;
  const offset = query.cursor ? Number(query.cursor) : 0;
  const page = items.slice(offset, offset + limit);
  const hasMore = offset + limit < items.length;
  const nextCursor = hasMore
    ? Buffer.from(String(offset + limit), "utf-8").toString("base64")
    : null;

  return {
    items: page,
    page: { limit, nextCursor, hasMore },
    summary: {
      scope: "filtered_result",
      totalCount: items.length,
      actionRequiredCount: items.filter((p) => p.operationalStatus === "attention_required").length,
      blockedCount: items.filter((p) => p.operationalStatus === "blocked").length,
      incidentHoldCount: items.filter((p) => p.operationalStatus === "incident_hold").length,
    },
    snapshot: {
      observedAt: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
    },
  };
}

const OVERVIEW_BY_KEY: Record<string, ProjectOverviewResponse> = {
  "orion-billing": {
    project: {
      projectKey: "orion-billing",
      name: "Orion 결제 플랫폼",
      description: "정기 결제 및 인보이스 자동화",
      archived: false,
      timezone: "Asia/Seoul",
      repository: {
        repositoryKey: "repo-orion",
        remoteUrlRedacted: "git@github.com:***/orion-billing.git",
        integrationBranch: "integrate",
        defaultBranch: "main",
      },
      activeConstraintProfile: { version: 4, approvedAt: iso(30) },
    },
    attention: {
      severity: "critical",
      operationalStatus: "incident_hold",
      reasons: [
        { code: "open_incident", count: 1, href: "/projects/orion-billing/incidents/inc-501" },
        { code: "blocked_component_work", count: 2, href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402" },
      ],
      nextRequiredHumanAction: {
        decisionKey: "dec-8821",
        title: "결제 재시도 정책 예외 승인",
        dueAt: iso(-1),
        href: "/projects/orion-billing/decisions/dec-8821",
      },
    },
    roadmap: {
      roadmapKey: "rm-01",
      title: "2026 Q3 정산 안정화",
      state: "active",
      requiredFeatureUnit: { total: 9, closed: 4, active: 2, blocked: 1, awaitingHuman: 2 },
      href: "/projects/orion-billing/roadmaps/rm-01",
    },
    focusFeatureUnit: {
      featureUnitKey: "fu-orion-402",
      title: "정산 배치 재시도 정책",
      state: "blocked",
      reason: "blocked",
      componentWork: { total: 4, running: 0, blocked: 2, needsRevision: 1, readyForPr: 0, prCreated: 1 },
      href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402",
    },
    focusFeatureUnitEmptyReason: null,
    componentWork: {
      items: [
        {
          componentWorkKey: "cw-orion-1",
          title: "재시도 큐 레코드 스키마",
          primaryComponent: { key: "billing-worker", displayName: "Billing Worker" },
          executionScope: "single",
          state: "blocked",
          attentionSeverity: "critical",
          activeRun: null,
          lastCommittedEventAt: iso(0, 1),
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-1",
        },
        {
          componentWorkKey: "cw-orion-2",
          title: "정산 API 멱등성 키",
          primaryComponent: { key: "billing-api", displayName: "Billing API" },
          executionScope: "coordinated",
          state: "needs_revision",
          attentionSeverity: "warning",
          activeRun: null,
          lastCommittedEventAt: iso(0, 3),
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-2",
        },
        {
          componentWorkKey: "cw-orion-3",
          title: "PR 리뷰 반영",
          primaryComponent: { key: "billing-api", displayName: "Billing API" },
          executionScope: "single",
          state: "pr_created",
          attentionSeverity: "none",
          activeRun: null,
          lastCommittedEventAt: iso(1, 0),
          href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3",
        },
      ],
      totalOpenCount: 4,
      omittedCount: 1,
    },
    executionFocus: {
      activeAttemptCount: 0,
      primary: null,
      capacity: {
        eligibleReadyWorkerCount: 2,
        eligibleDegradedWorkerCount: 0,
        queueDepthForProject: 1,
        oldestQueuedAt: iso(0, 2),
      },
    },
    decisionQueue: {
      items: [
        {
          decisionKey: "dec-8821",
          title: "결제 재시도 정책 예외 승인",
          targetType: "incident",
          requestedAt: iso(0, 5),
          dueAt: iso(-1),
          severity: "critical",
          href: "/projects/orion-billing/decisions/dec-8821",
        },
      ],
      totalPendingCount: 1,
      omittedCount: 0,
    },
    recentActivity: {
      items: [
        {
          eventKey: "evt-1",
          occurredAt: iso(0, 1),
          actorLabel: "system",
          kind: "incident",
          summary: "정산 배치 3회 연속 실패로 사고가 개설되었습니다",
          subject: { type: "incident", key: "inc-501", href: "/projects/orion-billing/incidents/inc-501" },
          evidenceHref: "/projects/orion-billing/incidents/inc-501",
        },
        {
          eventKey: "evt-2",
          occurredAt: iso(0, 3),
          actorLabel: "codex-agent-3",
          kind: "review",
          summary: "정산 API 멱등성 키 변경에 대해 변경 요청이 접수되었습니다",
          subject: { type: "component_work", key: "cw-orion-2", href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-2" },
          evidenceHref: "/reviews/rg-cw2-1",
        },
        {
          eventKey: "evt-3",
          occurredAt: iso(1, 0),
          actorLabel: "codex-agent-1",
          kind: "pull_request",
          summary: "PR #214가 생성되었습니다",
          subject: { type: "component_work", key: "cw-orion-3", href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3" },
          evidenceHref: "/pull-requests/pr-214",
        },
      ],
      omittedCount: 3,
    },
    dependencyMap: {
      isTruncated: false,
      omittedNodeCount: 0,
      nodes: [
        { featureUnitKey: "fu-orion-401", title: "정산 배치 스케줄러", state: "closed", attentionSeverity: "none", href: "#" },
        { featureUnitKey: "fu-orion-402", title: "정산 배치 재시도 정책", state: "blocked", attentionSeverity: "critical", href: "#" },
        { featureUnitKey: "fu-orion-403", title: "정산 실패 알림", state: "next_approved", attentionSeverity: "none", href: "#" },
      ],
      edges: [
        { fromFeatureUnitKey: "fu-orion-401", toFeatureUnitKey: "fu-orion-402", relation: "depends_on" },
        { fromFeatureUnitKey: "fu-orion-402", toFeatureUnitKey: "fu-orion-403", relation: "depends_on" },
      ],
      accessibleRows: [
        { featureUnitKey: "fu-orion-401", dependsOn: [], blocks: ["fu-orion-402"] },
        { featureUnitKey: "fu-orion-402", dependsOn: ["fu-orion-401"], blocks: ["fu-orion-403"] },
        { featureUnitKey: "fu-orion-403", dependsOn: ["fu-orion-402"], blocks: [] },
      ],
    },
    snapshot: {
      observedAt: new Date().toISOString(),
      resourceVersion: "rv-8821",
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
    },
  },
};

// Fallback overview generator so every project in the list can be opened.
function buildFallbackOverview(item: ProjectListItem): ProjectOverviewResponse {
  const severity = item.attention.severity;
  return {
    project: {
      projectKey: item.projectKey,
      name: item.name,
      description: item.description,
      archived: item.lifecycle === "archived",
      timezone: "Asia/Seoul",
      repository: item.lifecycle === "archived" ? null : {
        repositoryKey: `repo-${item.projectKey}`,
        remoteUrlRedacted: `git@github.com:***/${item.projectKey}.git`,
        integrationBranch: "integrate",
        defaultBranch: "main",
      },
      activeConstraintProfile: item.lifecycle === "archived" ? null : { version: 1, approvedAt: iso(60) },
    },
    attention: {
      severity,
      operationalStatus: item.operationalStatus,
      reasons: item.attention.reasons.map((code, i) => ({
        code,
        count: 1,
        href: `${item.links.overview}#reason-${i}`,
      })),
      nextRequiredHumanAction:
        item.attention.humanDecisionCount > 0
          ? {
              decisionKey: `dec-${item.projectKey}`,
              title: "보류 중인 결정 검토",
              dueAt: null,
              href: `${item.links.overview}/decisions`,
            }
          : null,
    },
    roadmap: item.lifecycle === "archived" ? null : {
      roadmapKey: "rm-01",
      title: "현재 로드맵",
      state: "active",
      requiredFeatureUnit: { total: 6, closed: 2, active: 1, blocked: 0, awaitingHuman: 0 },
      href: `${item.links.overview}/roadmaps/rm-01`,
    },
    focusFeatureUnit: item.activeFeatureUnit
      ? {
          featureUnitKey: item.activeFeatureUnit.featureUnitKey,
          title: item.activeFeatureUnit.title,
          state: item.activeFeatureUnit.state,
          reason: "active",
          componentWork: { total: item.componentWork.openCount, running: item.componentWork.activeCount, blocked: 0, needsRevision: 0, readyForPr: 0, prCreated: 0 },
          href: item.links.activeFeatureUnit ?? item.links.overview,
        }
      : null,
    focusFeatureUnitEmptyReason: item.activeFeatureUnit
      ? null
      : item.lifecycle === "archived"
        ? "project_archived"
        : "no_feature_units",
    componentWork: { items: [], totalOpenCount: item.componentWork.openCount, omittedCount: 0 },
    executionFocus: {
      activeAttemptCount: item.componentWork.activeCount,
      primary: null,
      capacity: { eligibleReadyWorkerCount: 2, eligibleDegradedWorkerCount: 0, queueDepthForProject: 0, oldestQueuedAt: null },
    },
    decisionQueue: { items: [], totalPendingCount: item.attention.humanDecisionCount, omittedCount: 0 },
    recentActivity: { items: [], omittedCount: 0 },
    dependencyMap: { isTruncated: false, omittedNodeCount: 0, nodes: [], edges: [], accessibleRows: [] },
    snapshot: {
      observedAt: new Date().toISOString(),
      resourceVersion: item.resourceVersion,
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
    },
  };
}

export function getProjectOverview(projectKey: string): ProjectOverviewResponse | null {
  if (OVERVIEW_BY_KEY[projectKey]) return OVERVIEW_BY_KEY[projectKey];
  const item = RAW_PROJECTS.find((p) => p.projectKey === projectKey);
  return item ? buildFallbackOverview(item) : null;
}

export function listAllProjectKeys(): string[] {
  return RAW_PROJECTS.map((p) => p.projectKey);
}
