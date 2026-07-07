/**
 * Domain types for GET /v1/job-attempts/{id}, GET /v1/job-attempts/{id}/logs,
 * and GET /v1/projects/{projectKey}/artifacts/{artifactKey}, sourced from the
 * orval-generated OpenAPI schema (src/generated/api/aDOPlatformAPI.schemas.ts)
 * instead of hand-duplicated. Distinct from ./job-attempt.ts and
 * ./artifact.ts, which are the hand-maintained Control Room UI-prototype
 * contracts these real responses get mapped into.
 *
 * Unlike ./ado-project.ts, fields here are kept optional (matching the
 * generated schema) rather than forced through `Required<>` — the backend
 * genuinely omits many of these (e.g. `priority`, `scheduledAt`, and every
 * field once an attempt hasn't reached a given lifecycle stage yet).
 */
import type {
  AdoJobAttemptDetailResponse,
  AdoJobLogPageResponse,
  AdoArtifactResponse,
} from "@/generated/api/aDOPlatformAPI.schemas";
import type { AttemptLogPageResponse, JobAttemptDetailResponse, JobAttemptState, LogStream } from "./job-attempt";
import type { ArtifactDetailResponse, ArtifactType } from "./artifact";

export type AdoJobAttemptDetail = AdoJobAttemptDetailResponse;
export type AdoJobLogPage = AdoJobLogPageResponse;
export type AdoArtifact = AdoArtifactResponse;

function computeDurationMs(startedAt: string | undefined, finishedAt: string | undefined): number | null {
  if (!startedAt || !finishedAt) return null;
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Maps the real backend response onto the UI's hand-maintained contract.
 * `agentRuns`/`commandRuns`/`artifacts` are always empty here — the backend
 * types them `unknown[]` until the Runner is implemented — so
 * `runnerDataAvailable: false` tells the UI to show an explicit "not
 * available yet" state instead of a misleading "no rows" empty state.
 */
export function mapJobAttemptDetail(jobAttemptId: string, real: AdoJobAttemptDetail): JobAttemptDetailResponse {
  return {
    attempt: {
      jobAttemptId: real.jobAttemptId ?? jobAttemptId,
      attemptNumber: real.attemptNumber ?? 0,
      state: (real.state ?? "queued") as JobAttemptState,
      job: {
        jobKey: real.job?.jobKey ?? "",
        type: real.job?.type ?? "",
        jobApiHref: real.job?.jobApiHref ?? null,
        target: {
          type: real.job?.target?.type ?? "",
          ref: real.job?.target?.ref ?? "",
          apiHref: real.job?.target?.apiHref ?? null,
          uiHref: real.job?.target?.uiHref ?? null,
          label: real.job?.target?.label ?? null,
        },
      },
      worker: real.worker ? { workerKey: real.worker.workerKey ?? "", href: real.worker.href ?? null } : null,
      lease: {
        leasedAt: real.lease?.leasedAt ?? null,
        expiresAt: real.lease?.expiresAt ?? null,
        lastHeartbeatAt: real.lease?.lastHeartbeatAt ?? null,
      },
      timing: {
        startedAt: real.timing?.startedAt ?? null,
        finishedAt: real.timing?.finishedAt ?? null,
        timeoutAt: real.timing?.timeoutAt ?? null,
        durationMs: computeDurationMs(real.timing?.startedAt, real.timing?.finishedAt),
      },
      terminal: {
        exitCode: real.terminal?.exitCode ?? null,
        signal: real.terminal?.signal ?? null,
        failureCode: real.terminal?.failureCode ?? null,
        redactedSummary: real.terminal?.redactedSummary ?? null,
      },
      resultArtifactHref: real.resultArtifactHref ?? null,
      replacementAttemptHref: null,
      resourceVersion: null,
    },
    runnerDataAvailable: false,
    agentRuns: [],
    commandRuns: [],
    artifacts: [],
    snapshot: { observedAt: new Date().toISOString(), requestId: crypto.randomUUID(), resourceVersion: "" },
  };
}

/** Maps the real log page onto the UI contract; `redaction` has no backend equivalent yet. */
export function mapAttemptLogPage(jobAttemptId: string, stream: LogStream, real: AdoJobLogPage): AttemptLogPageResponse {
  return {
    attemptId: real.attemptId ?? jobAttemptId,
    stream,
    entries: (real.entries ?? []).map((entry) => ({
      sequence: entry.sequence ?? 0,
      occurredAt: entry.occurredAt ?? "",
      level: (entry.level ?? "info") as "info" | "warn" | "error",
      text: entry.text ?? "",
    })),
    nextCursor: real.nextCursor ?? null,
    newestSequence: real.newestSequence ?? 0,
    redaction: null,
  };
}

/**
 * Maps the real Artifact response onto the UI contract. Only the fields the
 * backend actually has are populated; `mimeType`/`sourceVersion`/
 * `contextHash`/`retentionPolicy` are `null`, `specRevision`/`manifestHref`
 * are `null` (no spec-linkage concept on the backend yet), and `render`/
 * `provenance` are `null` (no rendering or provenance concept on the backend
 * yet) — the UI shows an explicit "not provided" state for each rather than
 * fabricating a value.
 */
export function mapArtifactDetail(projectKey: string, artifactKey: string, real: AdoArtifact): ArtifactDetailResponse {
  return {
    artifact: {
      artifactKey: real.artifactKey ?? artifactKey,
      projectKey,
      type: real.artifactType as ArtifactType,
      status: (real.status ?? "available") as ArtifactDetailResponse["artifact"]["status"],
      classification: (real.classification ?? "internal") as ArtifactDetailResponse["artifact"]["classification"],
      contentSha256: real.contentSha256 ?? "",
      mimeType: null,
      byteSize: real.byteSize ?? 0,
      sourceVersion: null,
      contextHash: null,
      specRevision: null,
      manifestHref: null,
      retentionPolicy: null,
      createdAt: real.createdAt ?? "",
    },
    render: null,
    provenance: null,
    downloadHref: null,
    snapshot: { observedAt: new Date().toISOString(), requestId: crypto.randomUUID() },
  };
}
