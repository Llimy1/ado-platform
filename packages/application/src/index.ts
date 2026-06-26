import type {
  ComponentWorkStatus,
  EvidenceGateCheck,
  EvidenceGateInput,
  FeatureUnitStatus,
  OrchestrationStatus,
  ReadinessSnapshot,
  RoadmapStatus,
  StateSubjectType,
  StateTransitionCheck,
  StateTransitionIntent
} from './types.js';

export type {
  ComponentWorkStatus,
  EvidenceGateCheck,
  EvidenceGateInput,
  FeatureUnitStatus,
  OrchestrationStatus,
  ReadinessSnapshot,
  RoadmapStatus,
  StateSubjectType,
  StateTransitionCheck,
  StateTransitionIntent
} from './types.js';

export interface DatabaseHealthPort {
  check(): Promise<void>;
}

export async function getReadinessSnapshot(database: DatabaseHealthPort): Promise<ReadinessSnapshot> {
  try {
    await database.check();
    return { state: 'ready', checkedAt: new Date().toISOString() };
  } catch {
    return { state: 'unavailable', checkedAt: new Date().toISOString() };
  }
}

const roadmapTransitions: ReadonlyMap<RoadmapStatus, readonly RoadmapStatus[]> = new Map([
  ['draft', ['analyzed', 'blocked', 'cancelled', 'incident_hold']],
  ['analyzed', ['review_ready', 'blocked', 'cancelled', 'incident_hold']],
  ['review_ready', ['approved', 'blocked', 'cancelled', 'incident_hold']],
  ['approved', ['active', 'blocked', 'cancelled', 'incident_hold']],
  ['active', ['completed', 'blocked', 'cancelled', 'incident_hold']],
  ['completed', ['archived']],
  ['incident_hold', ['draft', 'analyzed', 'review_ready', 'approved', 'active']]
]);

const featureUnitTransitions: ReadonlyMap<FeatureUnitStatus, readonly FeatureUnitStatus[]> = new Map([
  ['draft', ['ready_for_human_review', 'blocked', 'cancelled', 'incident_hold']],
  ['ready_for_human_review', ['approved', 'draft', 'blocked', 'cancelled', 'incident_hold']],
  ['approved', ['active', 'blocked', 'cancelled', 'incident_hold']],
  ['active', ['implementation_done', 'blocked', 'cancelled', 'incident_hold']],
  ['implementation_done', ['verification_running', 'blocked', 'cancelled', 'incident_hold']],
  ['verification_running', ['review_running', 'needs_revision', 'blocked', 'cancelled', 'incident_hold']],
  ['review_running', ['needs_revision', 'ready_for_pr', 'blocked', 'cancelled', 'incident_hold']],
  ['needs_revision', ['active', 'blocked', 'cancelled', 'incident_hold']],
  ['ready_for_pr', ['pr_created', 'blocked', 'cancelled', 'incident_hold']],
  ['pr_created', ['human_verification_pending', 'blocked', 'cancelled', 'incident_hold']],
  ['human_verification_pending', ['human_verified', 'needs_revision', 'blocked', 'cancelled', 'incident_hold']],
  ['human_verified', ['closed']],
  ['incident_hold', ['draft', 'ready_for_human_review', 'approved', 'active', 'needs_revision']]
]);

const componentWorkTransitions: ReadonlyMap<ComponentWorkStatus, readonly ComponentWorkStatus[]> = new Map([
  ['draft', ['ready', 'blocked', 'cancelled', 'incident_hold']],
  ['ready', ['branch_created', 'blocked', 'cancelled', 'incident_hold']],
  ['branch_created', ['implementation_running', 'blocked', 'cancelled', 'incident_hold']],
  ['implementation_running', ['implementation_done', 'needs_revision', 'blocked', 'cancelled', 'incident_hold']],
  ['implementation_done', ['verification_running', 'blocked', 'cancelled', 'incident_hold']],
  ['verification_running', ['verification_failed', 'local_review_running', 'blocked', 'cancelled', 'incident_hold']],
  ['verification_failed', ['needs_revision', 'blocked', 'cancelled', 'incident_hold']],
  ['local_review_running', ['local_review_done', 'blocked', 'cancelled', 'incident_hold']],
  ['local_review_done', ['arbiter_review_running', 'blocked', 'cancelled', 'incident_hold']],
  ['arbiter_review_running', ['needs_revision', 'ready_for_pr', 'blocked', 'cancelled', 'incident_hold']],
  ['needs_revision', ['implementation_running', 'blocked', 'cancelled', 'incident_hold']],
  ['ready_for_pr', ['pr_created', 'blocked', 'cancelled', 'incident_hold']],
  ['pr_created', ['closed']],
  ['incident_hold', ['draft', 'ready', 'implementation_running', 'needs_revision']]
]);

// 상태 전이의 최종 적용은 DB 트랜잭션에서만 수행한다. 이 함수는 사전 검증만 담당한다.
export function checkStateTransition(intent: StateTransitionIntent): StateTransitionCheck {
  const allowedTargets = transitionMapFor(intent.subjectType)?.get(intent.from as never) as
    | readonly OrchestrationStatus[]
    | undefined;

  if (!allowedTargets?.includes(intent.to)) {
    return {
      allowed: false,
      reason: `${intent.subjectType} cannot transition from ${intent.from} to ${intent.to}`
    };
  }

  return { allowed: true, reason: 'transition is allowed by the A2 state skeleton' };
}

export function evaluateEvidenceGate(input: EvidenceGateInput): EvidenceGateCheck {
  const missingEvidenceTypes = input.requiredEvidenceTypes.filter((requiredType) =>
    input.evidence.every((evidence) => evidence.evidenceType !== requiredType)
  );
  const invalidEvidenceTypes = input.evidence
    .filter((evidence) => evidence.targetStateSubjectId !== input.targetStateSubjectId || evidence.status !== 'valid')
    .map((evidence) => evidence.evidenceType);

  if (missingEvidenceTypes.length > 0 || invalidEvidenceTypes.length > 0) {
    return { decision: 'failed', missingEvidenceTypes, invalidEvidenceTypes };
  }

  return { decision: 'passed', missingEvidenceTypes: [], invalidEvidenceTypes: [] };
}

function transitionMapFor(subjectType: StateSubjectType):
  | ReadonlyMap<RoadmapStatus, readonly RoadmapStatus[]>
  | ReadonlyMap<FeatureUnitStatus, readonly FeatureUnitStatus[]>
  | ReadonlyMap<ComponentWorkStatus, readonly ComponentWorkStatus[]>
  | undefined {
  if (subjectType === 'roadmap') return roadmapTransitions;
  if (subjectType === 'feature_unit') return featureUnitTransitions;
  if (subjectType === 'component_work') return componentWorkTransitions;
  return undefined;
}
