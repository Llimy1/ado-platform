/**
 * Mirrors GET /v1/projects/{projectKey}/artifacts/{artifactKey} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.1. Hand-maintained UI-prototype types;
 * see note in ./projects.ts.
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
  | "allowed_paths";

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
    mimeType: string;
    byteSize: number;
    sourceVersion: string;
    contextHash: string;
    specRevision: number | null;
    manifestHref: string | null;
    retentionPolicy: string;
    createdAt: string;
  };
  render: {
    kind: ArtifactRenderKind;
    /** Present only when kind !== 'unavailable'. */
    contentHref: string | null;
    unavailableReason: string | null;
  };
  provenance: Array<{
    edgeKey: string;
    relation: string;
    subject: { type: string; key: string; title: string; href: string };
  }>;
  downloadHref: string | null;
  snapshot: { observedAt: string; requestId: string };
}
