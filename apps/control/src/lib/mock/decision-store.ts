import type { DecisionDetailResponse, DecisionListItem, DecisionListResponse } from "@/lib/contracts/decision";

/**
 * In-memory mock read model standing in for the Decision Inbox projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-09.1. Prototype-only data;
 * no database or Spring service is involved.
 *
 * Decision detail intentionally carries no generic approve/reject action:
 * planning, Feature Unit, verification, pause, recovery, and incident
 * decisions each use their owning page's own command schema. This inbox
 * only surfaces evidence and routes the operator to that context.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

/** Nested-address enforcement (P-11.3): only served under its real project scope. */
const SCOPE: Record<string, string> = {
  "dec-8821": "orion-billing",
  "dec-nova-support-1": "nova-support",
  "dec-lyra-inventory-1": "lyra-inventory",
  "dec-rm01-approve": "orion-billing",
};

const RICH: Record<string, DecisionDetailResponse> = {
  "dec-8821": {
    decision: {
      decisionKey: "dec-8821",
      decisionType: "incident_recovery_policy_exception",
      status: "pending",
      severity: "critical",
      target: { type: "incident", key: "inc-501", title: "정산 배치 3회 연속 실패", href: "/projects/orion-billing/incidents/inc-501" },
      requestedActor: "system",
      requestedAt: iso(0, 5),
      dueAt: iso(-1),
      expiresAt: null,
      resourceVersion: "rv-8821",
    },
    gateSummary:
      "3회 연속 검증 실패로 사고가 개설되어 재시도 큐 레코드 스키마 작업이 차단되었습니다. 결제 재시도 정책 예외를 승인해야 차단이 해제됩니다.",
    evidenceManifest: [
      { label: "사고 상세", href: "/projects/orion-billing/incidents/inc-501", kind: "incident" },
      { label: "최근 검증 실행", href: "/verification-runs/vr-cw1-3", kind: "verification_run" },
      { label: "검증 요약 근거", href: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-verification-summary", kind: "artifact" },
    ],
    allowedChoices: [
      { choiceKey: "approve_exception", label: "예외 승인", reasonRequired: true },
      { choiceKey: "reject_exception", label: "예외 거부 및 정책 유지", reasonRequired: true },
    ],
    priorDecisionHref: null,
    supersedingDecisionHref: null,
    resolution: { choiceKey: null, decidedAt: null, actorLabel: null, reason: null },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-8821" },
  },
  "dec-nova-support-1": {
    decision: {
      decisionKey: "dec-nova-support-1",
      decisionType: "feature_unit_planning_approval",
      status: "pending",
      severity: "warning",
      target: { type: "feature_unit", key: "fu-nova-076", title: "상담원 응답 초안 생성", href: "/projects/nova-support/roadmaps/rm-01/feature-units/fu-nova-076" },
      requestedActor: "system",
      requestedAt: iso(0, 6),
      dueAt: null,
      expiresAt: null,
      resourceVersion: "rv-nova-076-plan",
    },
    gateSummary: "Feature Unit 계획이 사람 승인 대기 중입니다. 결정은 해당 Feature Unit 화면의 계획 승인 게이트에서 기록됩니다.",
    evidenceManifest: [
      { label: "Feature Unit 상세", href: "/projects/nova-support/roadmaps/rm-01/feature-units/fu-nova-076", kind: "feature_unit" },
    ],
    allowedChoices: [
      { choiceKey: "approve_plan", label: "계획 승인", reasonRequired: false },
      { choiceKey: "request_changes", label: "수정 요청", reasonRequired: true },
    ],
    priorDecisionHref: null,
    supersedingDecisionHref: null,
    resolution: { choiceKey: null, decidedAt: null, actorLabel: null, reason: null },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-nova-076-plan" },
  },
  "dec-lyra-inventory-1": {
    decision: {
      decisionKey: "dec-lyra-inventory-1",
      decisionType: "feature_unit_planning_approval",
      status: "pending",
      severity: "warning",
      target: { type: "feature_unit", key: "fu-lyra-140", title: "재고 스냅샷 정합성 검증", href: "/projects/lyra-inventory/roadmaps/rm-01/feature-units/fu-lyra-140" },
      requestedActor: "system",
      requestedAt: iso(0, 9),
      dueAt: null,
      expiresAt: null,
      resourceVersion: "rv-lyra-140-plan",
    },
    gateSummary: "Feature Unit 계획이 사람 승인 대기 중입니다. 결정은 해당 Feature Unit 화면의 계획 승인 게이트에서 기록됩니다.",
    evidenceManifest: [
      { label: "Feature Unit 상세", href: "/projects/lyra-inventory/roadmaps/rm-01/feature-units/fu-lyra-140", kind: "feature_unit" },
    ],
    allowedChoices: [
      { choiceKey: "approve_plan", label: "계획 승인", reasonRequired: false },
      { choiceKey: "request_changes", label: "수정 요청", reasonRequired: true },
    ],
    priorDecisionHref: null,
    supersedingDecisionHref: null,
    resolution: { choiceKey: null, decidedAt: null, actorLabel: null, reason: null },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-lyra-140-plan" },
  },
  "dec-rm01-approve": {
    decision: {
      decisionKey: "dec-rm01-approve",
      decisionType: "roadmap_approval",
      status: "resolved",
      severity: "none",
      target: { type: "configuration", key: "rm-01", title: "2026 Q3 정산 안정화 로드맵", href: "/projects/orion-billing/roadmaps/rm-01" },
      requestedActor: "system",
      requestedAt: iso(41),
      dueAt: null,
      expiresAt: null,
      resourceVersion: "rv-rm01-approve",
    },
    gateSummary: "로드맵 분석이 완료되어 실행 단계로 전환하려면 사람 승인이 필요했습니다.",
    evidenceManifest: [
      { label: "로드맵 상세", href: "/projects/orion-billing/roadmaps/rm-01", kind: "roadmap" },
      { label: "로드맵 문서 근거", href: "/projects/orion-billing/artifacts/artifact-rm-01", kind: "artifact" },
    ],
    allowedChoices: [
      { choiceKey: "approve_roadmap", label: "로드맵 승인", reasonRequired: false },
      { choiceKey: "request_changes", label: "수정 요청", reasonRequired: true },
    ],
    priorDecisionHref: null,
    supersedingDecisionHref: null,
    resolution: { choiceKey: "approve_roadmap", decidedAt: iso(40), actorLabel: "Human Owner", reason: null },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-rm01-approve" },
  },
};

/** Pending count reported per project overview/list (P-09.1). */
const PROJECT_TOTALS: Record<string, { projectName: string; totalCount: number }> = {
  "orion-billing": { projectName: "Orion 결제 플랫폼", totalCount: 1 },
  "nova-support": { projectName: "Nova 고객 지원 콘솔", totalCount: 1 },
  "lyra-inventory": { projectName: "Lyra 재고 관리", totalCount: 1 },
};

function toListItem(decisionKey: string, detail: DecisionDetailResponse): DecisionListItem {
  return {
    decisionKey,
    decisionType: detail.decision.decisionType,
    status: detail.decision.status,
    severity: detail.decision.severity,
    target: detail.decision.target,
    requestedActor: detail.decision.requestedActor,
    requestedAt: detail.decision.requestedAt,
    dueAt: detail.decision.dueAt,
    expiresAt: detail.decision.expiresAt,
    gateSummary: detail.gateSummary,
    allowedActionCount: detail.allowedChoices.length,
    href: `/projects/${SCOPE[decisionKey]}/decisions/${decisionKey}`,
  };
}

export function getDecisionList(projectKey: string | null): DecisionListResponse {
  const projectKeys = projectKey ? [projectKey] : Object.keys(PROJECT_TOTALS);
  const items: DecisionListItem[] = [];
  let expiredCount = 0;
  let criticalCount = 0;
  let omittedTotal = 0;

  for (const pk of projectKeys) {
    const totals = PROJECT_TOTALS[pk];
    if (!totals) continue;
    const keysForProject = Object.keys(SCOPE).filter((k) => SCOPE[k] === pk && RICH[k].decision.status === "pending");
    for (const key of keysForProject) {
      const detail = RICH[key];
      const item = toListItem(key, detail);
      items.push(item);
      if (item.dueAt && new Date(item.dueAt).getTime() < Date.now()) expiredCount += 1;
      if (item.severity === "critical") criticalCount += 1;
    }
    omittedTotal += Math.max(0, totals.totalCount - keysForProject.length);
  }

  items.sort((a, b) => {
    const aExpired = a.dueAt ? new Date(a.dueAt).getTime() < Date.now() : false;
    const bExpired = b.dueAt ? new Date(b.dueAt).getTime() < Date.now() : false;
    if (aExpired !== bExpired) return aExpired ? -1 : 1;
    if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
    return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
  });

  return {
    items,
    scope: projectKey ? { projectKey, projectName: PROJECT_TOTALS[projectKey]?.projectName ?? projectKey } : { projectKey: null, projectName: null },
    page: { limit: 50, nextCursor: null, hasMore: false },
    summary: { totalCount: items.length + omittedTotal, expiredCount, criticalCount },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  };
}

export function getDecisionDetail(projectKey: string, decisionKey: string): DecisionDetailResponse | null {
  const scope = SCOPE[decisionKey];
  if (!scope || scope !== projectKey) return null;
  return RICH[decisionKey] ?? null;
}
