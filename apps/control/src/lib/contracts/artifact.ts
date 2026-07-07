/**
 * Mirrors GET /v1/projects/{projectKey}/artifacts/{artifactKey} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.1. Hand-maintained UI-prototype types;
 * see note in ./projects.ts.
 */

/**
 * Mock-era vocabulary (spec_document..allowed_paths) and the real backend's
 * vocabulary (context_packet..arbiter_decision) only overlap on
 * review_packet/verification_summary — product hasn't aligned the two yet,
 * so both are kept as a union until that's resolved.
 */
export type ArtifactType =
  | "spec_document"
  | "constraint_profile"
  | "review_packet"
  | "verification_summary"
  | "diff"
  | "human_verification_evidence"
  | "pull_request_packet"
  | "incident_summary"
  | "allowed_paths"
  | "context_packet"
  | "candidate_artifact"
  | "implementation_artifact"
  | "git_diff_artifact"
  | "command_run_log"
  | "review_result"
  | "arbiter_decision";

export type ArtifactStatus = "available" | "quarantined" | "expired" | "deleted" | "redaction_failed";
export type ArtifactClassification = "internal" | "restricted";
export type ArtifactRenderKind = "sanitized_text" | "document" | "image" | "unavailable";

export interface ArtifactDetailResponse {
  artifact: {
    artifactKey: string;
    projectKey: string;
    type: ArtifactType;
    status: ArtifactStatus;
    classification: ArtifactClassification;
    contentSha256: string;
    /** Null when the source doesn't report it (real API has no mimeType field yet). */
    mimeType: string | null;
    byteSize: number;
    /** Null when the source doesn't report it (real API has no sourceVersion field yet). */
    sourceVersion: string | null;
    /** Null when the source doesn't report it (real API has no contextHash field yet). */
    contextHash: string | null;
    specRevision: number | null;
    manifestHref: string | null;
    /** Null when the source doesn't report it (real API has no retentionPolicy field yet). */
    retentionPolicy: string | null;
    createdAt: string;
  };
  /** Null when the source has no rendering concept yet (real API doesn't). */
  render: {
    kind: ArtifactRenderKind;
    /** Present only when kind !== 'unavailable'. */
    contentHref: string | null;
    unavailableReason: string | null;
  } | null;
  /** Null when the source has no provenance graph yet (real API doesn't) — distinct from an empty array (no related entities). */
  provenance: Array<{
    edgeKey: string;
    relation: string;
    subject: { type: string; key: string; title: string; href: string };
  }> | null;
  downloadHref: string | null;
  snapshot: { observedAt: string; requestId: string };
}
