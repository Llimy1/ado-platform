import type { ArtifactDetailResponse, ArtifactType } from "@/lib/contracts/artifact";

/**
 * In-memory mock read model standing in for the Artifact projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.1. Prototype-only data;
 * no database or Spring service is involved. Nearly every other mock store
 * already links to `/projects/{projectKey}/artifacts/{artifactKey}` as
 * evidence — this store is what finally makes those links resolve.
 *
 * The browser never guesses renderability: `render.kind` is the only signal
 * a caller may use to decide what to show, and `quarantined`/`restricted`
 * fixtures below exist specifically to prove that path renders a
 * metadata-only unavailable state rather than raw content.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

/** Nested-address enforcement (P-11.3): only served under its real project scope. */
const SCOPE: Record<string, string> = {
  "artifact-fu404-hv1-evidence": "orion-billing",
  "artifact-rm-01": "orion-billing",
  "artifact-ja-cw1-3-diff": "orion-billing",
  "artifact-ja-cw1-3-verification-summary": "orion-billing",
  "artifact-rg-cw2-1-packet": "orion-billing",
  "artifact-pr-214-packet": "orion-billing",
  "allowed-paths-v4": "orion-billing",
  "artifact-inc501-summary": "orion-billing",
  "constraint-profile-4": "orion-billing",
};

const RICH: Record<string, ArtifactDetailResponse> = {
  "artifact-fu404-hv1-evidence": {
    artifact: {
      artifactKey: "artifact-fu404-hv1-evidence",
      projectKey: "orion-billing",
      type: "human_verification_evidence",
      status: "available",
      classification: "internal",
      contentSha256: "e5f6a7b8c9d0",
      mimeType: "text/plain",
      byteSize: 4820,
      sourceVersion: "rv-fu404-6",
      contextHash: "ctx-hv1-8821",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(1, 2),
    },
    render: { kind: "sanitized_text", contentHref: "/projects/orion-billing/artifacts/artifact-fu404-hv1-evidence/content", unavailableReason: null },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "human_verification", key: "fu-orion-404", title: "정산 리포트 자동 발송 인간 검증", href: "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-404/human-verification" } },
    ],
    downloadHref: "/projects/orion-billing/artifacts/artifact-fu404-hv1-evidence/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "artifact-rm-01": {
    artifact: {
      artifactKey: "artifact-rm-01",
      projectKey: "orion-billing",
      type: "spec_document",
      status: "available",
      classification: "internal",
      contentSha256: "a1b2c3d4e5f6",
      mimeType: "text/markdown",
      byteSize: 18240,
      sourceVersion: "rv-rm01",
      contextHash: "ctx-rm01",
      specRevision: 3,
      manifestHref: "/projects/orion-billing/artifacts/artifact-rm-01-manifest",
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(30),
    },
    render: { kind: "document", contentHref: "/projects/orion-billing/artifacts/artifact-rm-01/content", unavailableReason: null },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "roadmap", key: "rm-01", title: "2026 Q3 정산 안정화", href: "/projects/orion-billing/roadmaps/rm-01" } },
    ],
    downloadHref: "/projects/orion-billing/artifacts/artifact-rm-01/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "artifact-ja-cw1-3-diff": {
    artifact: {
      artifactKey: "artifact-ja-cw1-3-diff",
      projectKey: "orion-billing",
      type: "diff",
      status: "available",
      classification: "internal",
      contentSha256: "d1ff3a1b2c3d",
      mimeType: "text/x-diff",
      byteSize: 6120,
      sourceVersion: "rv-cw1-7",
      contextHash: "ctx-ja-cw1-3",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(0, 1),
    },
    render: { kind: "sanitized_text", contentHref: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-diff/content", unavailableReason: null },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "job_attempt", key: "ja-cw1-3", title: "3번째 시도 (실패)", href: "/runs/ja-cw1-3" } },
    ],
    downloadHref: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-diff/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "artifact-ja-cw1-3-verification-summary": {
    artifact: {
      artifactKey: "artifact-ja-cw1-3-verification-summary",
      projectKey: "orion-billing",
      type: "verification_summary",
      status: "available",
      classification: "internal",
      contentSha256: "5566778899aa",
      mimeType: "text/plain",
      byteSize: 2140,
      sourceVersion: "rv-cw1-7",
      contextHash: "ctx-vr-cw1-3",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(0, 1),
    },
    render: { kind: "sanitized_text", contentHref: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-verification-summary/content", unavailableReason: null },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "verification_run", key: "vr-cw1-3", title: "재시도 큐 레코드 스키마 검증 실행", href: "/verification-runs/vr-cw1-3" } },
    ],
    downloadHref: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-verification-summary/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "artifact-rg-cw2-1-packet": {
    artifact: {
      artifactKey: "artifact-rg-cw2-1-packet",
      projectKey: "orion-billing",
      type: "review_packet",
      status: "available",
      classification: "internal",
      contentSha256: "99aa88bb77cc",
      mimeType: "text/markdown",
      byteSize: 9840,
      sourceVersion: "rv-cw2-4",
      contextHash: "ctx-rg-cw2-1",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(0, 8),
    },
    render: { kind: "document", contentHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-packet/content", unavailableReason: null },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "review_group", key: "rg-cw2-1", title: "정산 API 멱등성 키 리뷰", href: "/reviews/rg-cw2-1" } },
    ],
    downloadHref: "/projects/orion-billing/artifacts/artifact-rg-cw2-1-packet/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "artifact-pr-214-packet": {
    artifact: {
      artifactKey: "artifact-pr-214-packet",
      projectKey: "orion-billing",
      type: "pull_request_packet",
      status: "available",
      classification: "internal",
      contentSha256: "f0a1b2c3d4e5",
      mimeType: "text/markdown",
      byteSize: 5210,
      sourceVersion: "rv-pr214",
      contextHash: "ctx-pr-214",
      specRevision: 1,
      manifestHref: null,
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(1),
    },
    render: { kind: "document", contentHref: "/projects/orion-billing/artifacts/artifact-pr-214-packet/content", unavailableReason: null },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "pull_request", key: "pr-214", title: "PR #214", href: "/pull-requests/pr-214" } },
    ],
    downloadHref: "/projects/orion-billing/artifacts/artifact-pr-214-packet/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "allowed-paths-v4": {
    artifact: {
      artifactKey: "allowed-paths-v4",
      projectKey: "orion-billing",
      type: "allowed_paths",
      status: "available",
      classification: "internal",
      contentSha256: "aabbccdd0011",
      mimeType: "application/json",
      byteSize: 860,
      sourceVersion: "v4",
      contextHash: "ctx-allowed-paths-v4",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "구성 변경 시까지 보존",
      createdAt: iso(45),
    },
    render: { kind: "sanitized_text", contentHref: "/projects/orion-billing/artifacts/allowed-paths-v4/content", unavailableReason: null },
    provenance: [],
    downloadHref: "/projects/orion-billing/artifacts/allowed-paths-v4/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "artifact-inc501-summary": {
    artifact: {
      artifactKey: "artifact-inc501-summary",
      projectKey: "orion-billing",
      type: "incident_summary",
      status: "quarantined",
      classification: "restricted",
      contentSha256: "bad0bad0bad0",
      mimeType: "text/plain",
      byteSize: 1120,
      sourceVersion: "rv-inc501-2",
      contextHash: "ctx-inc501",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "격리 검토 대기",
      createdAt: iso(0, 1),
    },
    render: { kind: "unavailable", contentHref: null, unavailableReason: "격리된 근거는 재검토가 끝날 때까지 미리보기하거나 다운로드할 수 없습니다." },
    provenance: [
      { edgeKey: "p1", relation: "generated_by", subject: { type: "incident", key: "inc-501", title: "정산 배치 3회 연속 실패", href: "/projects/orion-billing/incidents/inc-501" } },
    ],
    downloadHref: null,
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
  "constraint-profile-4": {
    artifact: {
      artifactKey: "constraint-profile-4",
      projectKey: "orion-billing",
      type: "constraint_profile",
      status: "available",
      classification: "internal",
      contentSha256: "a1c4e7b2",
      mimeType: "application/json",
      byteSize: 3320,
      sourceVersion: "v4",
      contextHash: "ctx-constraint-profile-4",
      specRevision: null,
      manifestHref: null,
      retentionPolicy: "구성 변경 시까지 보존",
      createdAt: iso(60),
    },
    render: { kind: "document", contentHref: "/projects/orion-billing/artifacts/constraint-profile-4/content", unavailableReason: null },
    provenance: [],
    downloadHref: "/projects/orion-billing/artifacts/constraint-profile-4/download",
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  },
};

const TYPE_BY_PREFIX: Array<{ prefix: string; type: ArtifactType }> = [
  { prefix: "spec-", type: "spec_document" },
  { prefix: "constraint-profile", type: "constraint_profile" },
  { prefix: "contract-", type: "spec_document" },
  { prefix: "artifact-rm-", type: "spec_document" },
];

function buildFallbackArtifact(projectKey: string, artifactKey: string): ArtifactDetailResponse {
  const type = TYPE_BY_PREFIX.find((t) => artifactKey.startsWith(t.prefix))?.type ?? "spec_document";
  return {
    artifact: {
      artifactKey,
      projectKey,
      type,
      status: "available",
      classification: "internal",
      contentSha256: "fallback0000",
      mimeType: "text/markdown",
      byteSize: 1024,
      sourceVersion: "rv-fallback",
      contextHash: `ctx-${artifactKey}`,
      specRevision: type === "spec_document" ? 1 : null,
      manifestHref: null,
      retentionPolicy: "표준 보존 (365일)",
      createdAt: iso(7),
    },
    render: { kind: "document", contentHref: `/projects/${projectKey}/artifacts/${artifactKey}/content`, unavailableReason: null },
    provenance: [],
    downloadHref: `/projects/${projectKey}/artifacts/${artifactKey}/download`,
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  };
}

export function getArtifactDetail(projectKey: string, artifactKey: string): ArtifactDetailResponse | null {
  const scope = SCOPE[artifactKey];
  if (scope) {
    return scope === projectKey ? RICH[artifactKey] : null;
  }
  return buildFallbackArtifact(projectKey, artifactKey);
}
