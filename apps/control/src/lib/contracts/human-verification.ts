/**
 * Mirrors GET .../human-verification and the two command bodies from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-08.3. Hand-maintained UI-prototype
 * types; see note in ./projects.ts.
 */

export type HumanVerificationItemResult = "passed" | "failed" | "skipped";
export type HumanVerificationFinalDecision = "human_verified" | "changes_requested";

export interface HumanVerificationResponse {
  featureUnit: { featureUnitKey: string; title: string; state: string; resourceVersion: string };
  gate: {
    explanationCode: string;
    finalDecisionEligible: boolean;
    requiredItemsRemaining: number;
  };
  requiredPrLinks: Array<{ componentWorkKey: string; title: string; pullRequestId: string; href: string }>;
  checklist: {
    required: Array<HumanVerificationChecklistItem>;
    optional: Array<HumanVerificationChecklistItem>;
  };
  resultHistory: {
    items: Array<{
      eventKey: string;
      occurredAt: string;
      itemTitle: string;
      result: HumanVerificationItemResult;
      actorLabel: string;
      evidenceHref: string | null;
    }>;
    omittedCount: number;
  };
  finalDecision: {
    decision: HumanVerificationFinalDecision | null;
    decidedAt: string | null;
    actorLabel: string | null;
    reason: string | null;
  };
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}

export interface HumanVerificationChecklistItem {
  itemKey: string;
  title: string;
  instructions: string;
  required: boolean;
  latestResult: {
    result: HumanVerificationItemResult;
    recordedAt: string;
    actorLabel: string;
    reason: string | null;
    evidenceHref: string | null;
  } | null;
  canRecordResult: boolean;
}

/** Not wired to any backend in this prototype. */
export interface RecordHumanVerificationItemRequest {
  result: HumanVerificationItemResult;
  expectedFeatureUnitVersion: string;
  reason?: string;
  evidenceArtifactKey?: string;
}

/** Not wired to any backend in this prototype. */
export interface RecordHumanVerificationDecisionRequest {
  decision: HumanVerificationFinalDecision;
  expectedFeatureUnitVersion: string;
  reason?: string;
}
