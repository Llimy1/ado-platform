import type {
  AttentionSeverity,
  ProjectAttentionReason,
  ProjectOperationalStatus,
} from "@/lib/contracts/projects";
import type { RoadmapState } from "@/lib/contracts/roadmaps";
import type { AdoRoadmap } from "@/lib/contracts/ado-roadmap";
import type { FeatureUnitRiskLevel } from "@/lib/contracts/feature-unit";
import type { DecisionStatus } from "@/lib/contracts/decision";
import type { IncidentSeverity, IncidentState } from "@/lib/contracts/incident";
import type { WorkerHealthState } from "@/lib/contracts/system-health";
import type { StatusTone } from "@/components/StatusBadge";

/**
 * Every date/time shown in this app must go through formatRelativeTime or
 * formatAbsoluteTime below — never format a Date/ISO string inline in a
 * component. This keeps timezone and locale behavior in one place.
 */
export const DEFAULT_DISPLAY_TIME_ZONE = "Asia/Seoul";

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  const diffMonth = Math.round(diffDay / 30);
  return `${diffMonth}개월 전`;
}

/** `timeZone` defaults to Asia/Seoul (the ADO Control Room's operating timezone); pass an IANA zone to override for a specific display. */
export function formatAbsoluteTime(iso: string, timeZone: string = DEFAULT_DISPLAY_TIME_ZONE): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(iso));
}

export const OPERATIONAL_STATUS_LABEL: Record<ProjectOperationalStatus, string> = {
  healthy: "정상",
  attention_required: "검토 필요",
  blocked: "차단됨",
  incident_hold: "사고 보류",
  archived: "보관됨",
};

export const OPERATIONAL_STATUS_TONE: Record<
  ProjectOperationalStatus,
  "success" | "warning" | "failure" | "queued" | "info"
> = {
  healthy: "success",
  attention_required: "warning",
  blocked: "failure",
  incident_hold: "failure",
  archived: "queued",
};

export const ATTENTION_REASON_LABEL: Record<ProjectAttentionReason, string> = {
  human_decision_required: "사람 판단 필요",
  blocked_feature_unit: "차단된 기능 단위",
  blocked_component_work: "차단된 컴포넌트 작업",
  verification_failed: "검증 실패",
  accepted_review_finding: "승인된 리뷰 지적사항",
  open_incident: "진행 중인 사고",
};

export const ATTENTION_SEVERITY_LABEL: Record<AttentionSeverity, string> = {
  none: "정상",
  warning: "주의",
  critical: "긴급",
};

export const ATTENTION_SEVERITY_TONE: Record<AttentionSeverity, StatusTone> = {
  none: "success",
  warning: "warning",
  critical: "failure",
};

export const DECISION_STATUS_LABEL: Record<DecisionStatus, string> = {
  pending: "대기 중",
  expired: "기한 초과",
  superseded: "대체됨",
  resolved: "해결됨",
  denied: "거부됨",
};

export const DECISION_STATUS_TONE: Record<DecisionStatus, StatusTone> = {
  pending: "warning",
  expired: "failure",
  superseded: "queued",
  resolved: "success",
  denied: "failure",
};

export const INCIDENT_SEVERITY_LABEL: Record<IncidentSeverity, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  critical: "긴급",
};

export const INCIDENT_SEVERITY_TONE: Record<IncidentSeverity, StatusTone> = {
  low: "queued",
  medium: "info",
  high: "warning",
  critical: "failure",
};

export const INCIDENT_STATE_LABEL: Record<IncidentState, string> = {
  open: "진행 중",
  acknowledged: "확인됨",
  recovery_requested: "복구 요청됨",
  recovering: "복구 중",
  resolved: "해결됨",
};

export const INCIDENT_STATE_TONE: Record<IncidentState, StatusTone> = {
  open: "failure",
  acknowledged: "warning",
  recovery_requested: "warning",
  recovering: "running",
  resolved: "success",
};

export const WORKER_HEALTH_STATE_LABEL: Record<WorkerHealthState, string> = {
  starting: "시작 중",
  ready: "준비됨",
  busy: "작업 중",
  draining: "드레이닝",
  stale: "지연됨",
  offline: "오프라인",
  blocked: "차단됨",
};

export const WORKER_HEALTH_STATE_TONE: Record<WorkerHealthState, StatusTone> = {
  starting: "queued",
  ready: "success",
  busy: "running",
  draining: "warning",
  stale: "warning",
  offline: "failure",
  blocked: "failure",
};

export const ROADMAP_STATE_LABEL: Record<RoadmapState, string> = {
  draft: "초안",
  analyzed: "분석 완료",
  review_ready: "검토 준비됨",
  approved: "승인됨",
  active: "실행 중",
  completed: "완료",
  archived: "보관됨",
  blocked: "차단됨",
  cancelled: "취소됨",
  incident_hold: "사고 보류",
};

export const ROADMAP_STATE_TONE: Record<RoadmapState, StatusTone> = {
  draft: "queued",
  analyzed: "info",
  review_ready: "warning",
  approved: "success",
  active: "running",
  completed: "success",
  archived: "queued",
  blocked: "failure",
  cancelled: "queued",
  incident_hold: "failure",
};

/** Real `apps/api` Roadmap status (draft/active/archived) — reuses the mock ROADMAP_STATE vocabulary for the overlapping states. */
export const ADO_ROADMAP_STATUS_LABEL: Record<AdoRoadmap["status"], string> = {
  draft: "초안",
  active: "실행 중",
  archived: "보관됨",
};

export const ADO_ROADMAP_STATUS_TONE: Record<AdoRoadmap["status"], StatusTone> = {
  draft: "queued",
  active: "running",
  archived: "queued",
};

/**
 * Generic FeatureUnit/ComponentWork lifecycle-state label map, shared by the
 * Roadmap decomposition table (P-03.5) and Feature Unit detail (P-04.5).
 * Unknown values fall back to the raw machine value.
 */
export const LIFECYCLE_STATE_LABEL: Record<string, string> = {
  draft: "초안",
  ready_for_human_review: "검토 필요",
  approved: "승인됨",
  changes_requested: "변경 요청됨",
  active: "실행 중",
  queued: "대기",
  implementation_done: "구현 완료",
  verification_running: "검증 중",
  review_running: "리뷰 중",
  needs_revision: "검토 필요",
  ready_for_pr: "PR 준비됨",
  pr_created: "PR 생성됨",
  human_verification_pending: "사람 검증 대기",
  human_verified: "사람 검증 완료",
  closed: "완료",
  blocked: "차단됨",
  incident_hold: "사고 보류",
  cancelled: "취소됨",
  not_started: "시작 전",
  running: "실행 중",
  passed: "통과",
  failed: "실패",
  not_applicable: "해당 없음",
  timed_out: "타임아웃",
  evidence_invalid: "근거 무효",
  skipped: "건너뜀",
};

export const LIFECYCLE_STATE_TONE: Record<string, StatusTone> = {
  draft: "queued",
  ready_for_human_review: "warning",
  approved: "success",
  changes_requested: "warning",
  active: "running",
  queued: "queued",
  implementation_done: "info",
  verification_running: "running",
  review_running: "running",
  needs_revision: "warning",
  ready_for_pr: "success",
  pr_created: "success",
  human_verification_pending: "warning",
  human_verified: "success",
  closed: "success",
  blocked: "failure",
  incident_hold: "failure",
  cancelled: "queued",
  not_started: "queued",
  running: "running",
  passed: "success",
  failed: "failure",
  not_applicable: "queued",
  timed_out: "warning",
  evidence_invalid: "failure",
  skipped: "queued",
};

export const RISK_LEVEL_LABEL: Record<FeatureUnitRiskLevel, string> = {
  low: "낮음",
  normal: "보통",
  high: "높음",
  security_sensitive: "보안 민감",
  production_data_related: "운영 데이터 관련",
};
