/**
 * Mirrors GET /v1/job-attempts/{jobAttemptId} and GET /v1/logs from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-06.2. Hand-maintained UI-prototype
 * types; see note in ./projects.ts.
 */

export type JobAttemptState =
  | "queued"
  | "leased"
  | "running"
  | "succeeded"
  | "failed"
  | "timed_out"
  | "cancelled"
  | "policy_denied"
  | "blocked"
  | "human_required";

export interface JobAttemptDetailResponse {
  attempt: {
    jobAttemptId: string;
    attemptNumber: number;
    state: JobAttemptState;
    job: { jobKey: string; type: string; targetHref: string };
    worker: { workerKey: string; href: string | null } | null;
    lease: { leasedAt: string | null; expiresAt: string | null; lastHeartbeatAt: string | null };
    timing: { startedAt: string | null; finishedAt: string | null; timeoutAt: string | null; durationMs: number | null };
    terminal: { exitCode: number | null; signal: string | null; failureCode: string | null; redactedSummary: string | null };
    resultArtifactHref: string | null;
    replacementAttemptHref: string | null;
    resourceVersion: string | null;
  };
  /**
   * False when the backend hasn't implemented the Runner yet, so agentRuns/
   * commandRuns/artifacts below are always empty regardless of what actually
   * ran — distinct from a legitimately-empty attempt.
   */
  runnerDataAvailable: boolean;
  agentRuns: Array<{
    agentRunId: string;
    role: string;
    provider: string;
    modelIdentifier: string;
    state: string;
    startedAt: string;
    finishedAt: string | null;
    outputArtifactHref: string | null;
    href: string;
  }>;
  commandRuns: Array<{
    commandRunId: string;
    commandKey: string;
    state: string;
    startedAt: string;
    finishedAt: string | null;
    exitCode: number | null;
    timedOut: boolean;
    stdoutAvailable: boolean;
    stderrAvailable: boolean;
    href: string;
  }>;
  artifacts: Array<{
    artifactKey: string;
    type: string;
    status: string;
    redactionStatus: string;
    byteSize: number;
    href: string | null;
  }>;
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}

export type LogStream = "stdout" | "stderr" | "system";

export interface AttemptLogPageResponse {
  attemptId: string;
  stream: LogStream;
  entries: Array<{ sequence: number; occurredAt: string; level: "info" | "warn" | "error"; text: string }>;
  nextCursor: string | null;
  newestSequence: number;
  /** Null when the source doesn't report redaction metadata (real API doesn't yet). */
  redaction: { applied: boolean; omittedEntryCount: number; reasonCode: string | null } | null;
}
