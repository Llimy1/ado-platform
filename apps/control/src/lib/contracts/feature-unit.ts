/**
 * Mirrors GET .../feature-units/{featureUnitKey} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-04.2/P-04.3. Hand-maintained
 * UI-prototype types; see note in ./projects.ts.
 */
import type { AttentionSeverity } from "./projects";

export type FeatureUnitRiskLevel = "low" | "normal" | "high" | "security_sensitive" | "production_data_related";

export type FeatureUnitPlanningGateState =
  | "not_ready"
  | "human_decision_required"
  | "approved"
  | "changes_requested"
  | "blocked";

export type FeatureUnitActivationGateState =
  | "not_approved"
  | "waiting_for_dependencies"
  | "eligible"
  | "active"
  | "blocked";

export interface FeatureUnitDetailResponse {
  featureUnit: {
    featureUnitKey: string;
    sequenceNumber: number;
    title: string;
    intent: string;
    state: string;
    riskLevel: FeatureUnitRiskLevel;
    constraintProfile: { version: number; contentSha256: string; href: string };
    spec: {
      artifactKey: string;
      revision: number;
      contentSha256: string;
      status: "draft" | "valid" | "superseded" | "rejected";
      href: string | null;
    };
    resourceVersion: string;
  };
  planningGate: {
    state: FeatureUnitPlanningGateState;
    explanationCode: string;
    allowedActions: Array<"record_human_decision">;
    expectedResourceVersion: string;
  };
  activationGate: {
    state: FeatureUnitActivationGateState;
    unmetDependencyCount: number;
    waivedDependencyCount: number;
    pauseOrIncidentBlocking: boolean;
    explanationCode: string;
  };
  acceptanceCriteria: {
    items: Array<{
      criterionKey: string;
      description: string;
      verificationMode: "command" | "artifact_review" | "human_check" | "mixed";
      required: boolean;
      status: string;
      evidenceHref: string | null;
    }>;
    totalCount: number;
    requiredCount: number;
  };
  dependencies: {
    prerequisites: Array<{
      featureUnitKey: string;
      title: string;
      relation: "depends_on" | "blocks";
      satisfied: boolean;
      waivedByDecisionHref: string | null;
      href: string;
    }>;
    dependents: Array<{
      featureUnitKey: string;
      title: string;
      relation: "depends_on" | "blocks";
      href: string;
    }>;
  };
  componentWork: {
    items: Array<{
      componentWorkKey: string;
      title: string;
      primaryComponent: { key: string; displayName: string };
      executionScope: "single" | "coordinated";
      scopeComponents: Array<{
        key: string;
        displayName: string;
        role: "primary" | "contributing" | "shared_contract";
      }>;
      required: boolean;
      state: string;
      verification: "not_started" | "running" | "passed" | "failed" | "not_applicable";
      review: "not_started" | "running" | "passed" | "changes_requested" | "human_required";
      pullRequest: { pullRequestId: string; status: string; href: string } | null;
      attentionSeverity: AttentionSeverity;
      href: string;
    }>;
    requiredCount: number;
    optionalCount: number;
    omittedCount: number;
  };
  componentContracts: {
    items: Array<{
      contractKey: string;
      title: string;
      type: string;
      status: string;
      required: boolean;
      producerComponent: string;
      consumerComponent: string;
      href: string | null;
    }>;
    omittedCount: number;
  };
  humanVerification: {
    state: "not_available" | "pending" | "in_progress" | "passed" | "failed";
    requiredItemCount: number;
    passedRequiredItemCount: number;
    failedRequiredItemCount: number;
    href: string | null;
  };
  timeline: {
    items: Array<{
      eventKey: string;
      occurredAt: string;
      actorLabel: string;
      kind: "state_transition" | "verification" | "review" | "decision" | "pull_request" | "incident";
      fromState: string | null;
      toState: string | null;
      summary: string;
      evidenceHref: string | null;
    }>;
    omittedCount: number;
  };
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}

/** POST .../feature-units/{featureUnitKey}/commands/record-human-decision request body. Not wired to any backend in this prototype. */
export interface RecordFeatureUnitPlanningDecisionRequest {
  decision: "approved" | "changes_requested";
  expectedResourceVersion: string;
  reason?: string;
}
