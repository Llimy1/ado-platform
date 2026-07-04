import type { IncidentDetailResponse, IncidentListResponse } from "@/lib/contracts/incident";

/**
 * In-memory mock read model standing in for the Incident projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-09.2. Prototype-only data;
 * no database or Spring service is involved. `inc-501` is the same incident
 * already referenced from project-store, component-work-store, and
 * feature-unit-store as the cause of cw-orion-1/fu-orion-402 being blocked.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

const SCOPE: Record<string, string> = {
  "inc-501": "orion-billing",
};

const RICH: Record<string, IncidentDetailResponse> = {
  "inc-501": {
    incident: {
      incidentKey: "inc-501",
      projectKey: "orion-billing",
      projectName: "Orion 결제 플랫폼",
      title: "정산 배치 3회 연속 실패",
      severity: "critical",
      state: "open",
      openedAt: iso(0, 1),
      resourceVersion: "rv-inc501-2",
    },
    safetyEvent: {
      safetyEventKey: "se-inc501-1",
      kind: "repeated_verification_failure",
      detectedAt: iso(0, 1),
      summary: "재시도 큐 레코드 스키마 작업이 3회 연속 필수 검증 명령 실패로 안전 임계값을 초과했습니다.",
    },
    affected: {
      featureUnits: [
        { featureUnitKey: "fu-orion-402", title: "정산 배치 재시도 정책", href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402" },
      ],
      componentWorks: [
        { componentWorkKey: "cw-orion-1", title: "재시도 큐 레코드 스키마", href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-1" },
      ],
      jobAttempts: [
        { jobAttemptId: "ja-cw1-3", title: "3번째 시도 (실패)", href: "/runs/ja-cw1-3" },
        { jobAttemptId: "ja-cw1-2", title: "2번째 시도 (실패)", href: "/runs/ja-cw1-2" },
        { jobAttemptId: "ja-cw1-1", title: "1번째 시도 (실패)", href: "/runs/ja-cw1-1" },
      ],
    },
    activePauseRecords: [
      {
        pauseRecordKey: "pr-inc501-1",
        scopeLabel: "cw-orion-1 (재시도 큐 레코드 스키마)",
        reason: "반복된 검증 실패로 자동화가 일시정지되었습니다",
        pausedAt: iso(0, 1),
        pausedByLabel: "system",
      },
    ],
    summaryArtifact: { artifactKey: "artifact-inc501-summary", href: "/projects/orion-billing/artifacts/artifact-inc501-summary" },
    recoveryEvidence: {
      required: ["재시도 정책 예외 승인 결정", "수정된 마이그레이션 스크립트에 대한 통과한 검증 실행"],
      submitted: [],
    },
    decisions: [
      { decisionKey: "dec-8821", title: "결제 재시도 정책 예외 승인", status: "pending", href: "/projects/orion-billing/decisions/dec-8821" },
    ],
    timeline: {
      items: [
        {
          eventKey: "inc501-tl-1",
          occurredAt: iso(0, 1),
          actorLabel: "system",
          summary: "3회 연속 검증 실패로 사고가 개설되고 cw-orion-1이 일시정지되었습니다",
          evidenceHref: "/verification-runs/vr-cw1-3",
        },
        {
          eventKey: "inc501-tl-2",
          occurredAt: iso(0, 1),
          actorLabel: "system",
          summary: "결제 재시도 정책 예외 승인 결정이 생성되었습니다",
          evidenceHref: "/projects/orion-billing/decisions/dec-8821",
        },
      ],
      omittedCount: 0,
    },
    allowedActions: ["acknowledge", "request_recovery"],
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}`, resourceVersion: "rv-inc501-2" },
  },
};

export function getIncidentList(): IncidentListResponse {
  const items = Object.entries(RICH).map(([incidentKey, detail]) => ({
    incidentKey,
    projectKey: detail.incident.projectKey,
    projectName: detail.incident.projectName,
    title: detail.incident.title,
    severity: detail.incident.severity,
    state: detail.incident.state,
    openedAt: detail.incident.openedAt,
    affectedSummary: `Feature Unit ${detail.affected.featureUnits.length}건, Component Work ${detail.affected.componentWorks.length}건 영향`,
    activePauseCount: detail.activePauseRecords.length,
    href: `/projects/${detail.incident.projectKey}/incidents/${incidentKey}`,
  }));

  return {
    items,
    page: { limit: 50, nextCursor: null, hasMore: false },
    summary: {
      openCount: items.filter((i) => i.state !== "resolved").length,
      criticalCount: items.filter((i) => i.severity === "critical").length,
    },
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  };
}

export function getIncidentDetail(projectKey: string, incidentKey: string): IncidentDetailResponse | null {
  const scope = SCOPE[incidentKey];
  if (!scope || scope !== projectKey) return null;
  return RICH[incidentKey] ?? null;
}
