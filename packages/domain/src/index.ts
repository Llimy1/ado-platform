export type HealthState = 'ready' | 'unavailable';

export interface ReadinessSnapshot {
  readonly state: HealthState;
  readonly checkedAt: string;
}

export const actorTypes = [
  'human',
  'system',
  'state_machine',
  'policy_engine',
  'evidence_gate',
  'worker',
  'codex',
  'local_model',
  'claude_import',
  'github',
  'unknown'
] as const;

export type ActorType = (typeof actorTypes)[number];

export const riskLevels = ['low', 'medium', 'high', 'critical'] as const;

export type RiskLevel = (typeof riskLevels)[number];

export const stateSubjectTypes = [
  'roadmap',
  'feature_unit',
  'component_work',
  'job',
  'artifact',
  'human_verification_item',
  'agent_ingest_run',
  'verification_run',
  'review_group',
  'command_run',
  'agent_run'
] as const;

export type StateSubjectType = (typeof stateSubjectTypes)[number];

export const roadmapStatuses = [
  'draft',
  'analyzed',
  'review_ready',
  'approved',
  'active',
  'completed',
  'archived',
  'blocked',
  'cancelled',
  'incident_hold'
] as const;

export type RoadmapStatus = (typeof roadmapStatuses)[number];

export const featureUnitStatuses = [
  'draft',
  'ready_for_human_review',
  'approved',
  'active',
  'implementation_done',
  'verification_running',
  'review_running',
  'needs_revision',
  'ready_for_pr',
  'pr_created',
  'human_verification_pending',
  'human_verified',
  'closed',
  'blocked',
  'cancelled',
  'incident_hold'
] as const;

export type FeatureUnitStatus = (typeof featureUnitStatuses)[number];

export const componentWorkStatuses = [
  'draft',
  'ready',
  'branch_created',
  'implementation_running',
  'implementation_done',
  'verification_running',
  'verification_failed',
  'local_review_running',
  'local_review_done',
  'arbiter_review_running',
  'needs_revision',
  'ready_for_pr',
  'pr_created',
  'closed',
  'blocked',
  'cancelled',
  'incident_hold'
] as const;

export type ComponentWorkStatus = (typeof componentWorkStatuses)[number];

export const jobStatuses = [
  'queued',
  'leased',
  'running',
  'succeeded',
  'failed',
  'timed_out',
  'cancelled',
  'policy_denied',
  'blocked',
  'human_required'
] as const;

export type JobStatus = (typeof jobStatuses)[number];

export type OrchestrationStatus =
  | RoadmapStatus
  | FeatureUnitStatus
  | ComponentWorkStatus
  | JobStatus;

export interface StateSubjectSnapshot {
  readonly id: string;
  readonly projectId: string;
  readonly subjectType: StateSubjectType;
  readonly subjectKey: string;
  readonly currentStatus: OrchestrationStatus;
  readonly previousStatus?: OrchestrationStatus;
  readonly isTerminal: boolean;
  readonly statusUpdatedAt: string;
}

export interface StateTransitionIntent {
  readonly subjectType: StateSubjectType;
  readonly from: OrchestrationStatus;
  readonly to: OrchestrationStatus;
  readonly transition: string;
}

export interface StateTransitionCheck {
  readonly allowed: boolean;
  readonly reason: string;
}

export interface EvidenceReference {
  readonly evidenceType: string;
  readonly targetStateSubjectId: string;
  readonly status: 'valid' | 'missing' | 'stale' | 'quarantined' | 'superseded' | 'invalid';
  readonly producedBy: ActorType;
  readonly sourceVersion?: string;
  readonly contextHash?: string;
}

export interface EvidenceGateInput {
  readonly targetStateSubjectId: string;
  readonly requiredEvidenceTypes: readonly string[];
  readonly evidence: readonly EvidenceReference[];
}

export type EvidenceGateDecision = 'passed' | 'failed' | 'human_required' | 'blocked';

export interface EvidenceGateCheck {
  readonly decision: EvidenceGateDecision;
  readonly missingEvidenceTypes: readonly string[];
  readonly invalidEvidenceTypes: readonly string[];
}

export interface ProjectSummary {
  readonly projectKey: string;
  readonly name: string;
  readonly timezone: string;
  readonly isArchived: boolean;
}
