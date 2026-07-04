import type { HumanVerificationResponse } from "@/lib/contracts/human-verification";

/**
 * In-memory mock read model standing in for the human verification
 * projection described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-08.3.
 * Prototype-only data; no database or Spring service is involved.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

/** Nested-address enforcement (P-11.3): only served under its real project/roadmap/featureUnit scope. */
const SCOPE: Record<string, { projectKey: string; roadmapKey: string }> = {
  "fu-orion-404": { projectKey: "orion-billing", roadmapKey: "rm-01" },
};

const RESPONSES: Record<string, HumanVerificationResponse> = {
  "fu-orion-404": {
    featureUnit: {
      featureUnitKey: "fu-orion-404",
      title: "정산 리포트 자동 발송",
      state: "human_verification_pending",
      resourceVersion: "rv-fu404-6",
    },
    gate: {
      explanationCode: "required_items_remaining",
      finalDecisionEligible: false,
      requiredItemsRemaining: 2,
    },
    requiredPrLinks: [
      { componentWorkKey: "cw-orion-5", title: "리포트 생성 배치", pullRequestId: "pr-198", href: "/pull-requests/pr-198" },
      { componentWorkKey: "cw-orion-6", title: "발송 알림 템플릿", pullRequestId: "pr-199", href: "/pull-requests/pr-199" },
    ],
    checklist: {
      required: [
        {
          itemKey: "hv-1",
          title: "월별 리포트가 실제 운영 데이터로 정상 생성되는지 확인",
          instructions: "스테이징 환경에서 리포트 생성 배치를 수동 실행하고, 생성된 리포트의 합계가 정산 대사 결과와 일치하는지 확인합니다.",
          required: true,
          latestResult: {
            result: "passed",
            recordedAt: iso(1, 2),
            actorLabel: "Human Owner",
            reason: null,
            evidenceHref: "/projects/orion-billing/artifacts/artifact-fu404-hv1-evidence",
          },
          canRecordResult: true,
        },
        {
          itemKey: "hv-2",
          title: "발송 알림이 지정된 수신자 목록으로만 전송되는지 확인",
          instructions: "테스트 수신자 목록으로 발송을 실행하고, 알림이 정확히 해당 목록에만 전달되는지 확인합니다.",
          required: true,
          latestResult: null,
          canRecordResult: true,
        },
        {
          itemKey: "hv-3",
          title: "리포트에 운영 데이터가 아닌 민감정보가 포함되지 않는지 확인",
          instructions: "생성된 리포트 샘플을 검토해 카드번호, 계좌번호 등 마스킹되지 않은 민감정보가 없는지 확인합니다.",
          required: true,
          latestResult: null,
          canRecordResult: true,
        },
      ],
      optional: [
        {
          itemKey: "hv-4",
          title: "리포트 생성 소요 시간이 SLA(10분) 이내인지 확인",
          instructions: "배치 실행 로그에서 시작/종료 시각을 확인해 10분 이내에 완료되는지 확인합니다.",
          required: false,
          latestResult: null,
          canRecordResult: true,
        },
      ],
    },
    resultHistory: {
      items: [
        {
          eventKey: "hv-hist-1",
          occurredAt: iso(1, 2),
          itemTitle: "월별 리포트가 실제 운영 데이터로 정상 생성되는지 확인",
          result: "passed",
          actorLabel: "Human Owner",
          evidenceHref: "/projects/orion-billing/artifacts/artifact-fu404-hv1-evidence",
        },
      ],
      omittedCount: 0,
    },
    finalDecision: { decision: null, decidedAt: null, actorLabel: null, reason: null },
    snapshot: {
      observedAt: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      resourceVersion: "rv-fu404-6",
    },
  },
};

export function getHumanVerification(
  projectKey: string,
  roadmapKey: string,
  featureUnitKey: string,
): HumanVerificationResponse | null {
  const scope = SCOPE[featureUnitKey];
  if (!scope || scope.projectKey !== projectKey || scope.roadmapKey !== roadmapKey) return null;
  return RESPONSES[featureUnitKey] ?? null;
}
