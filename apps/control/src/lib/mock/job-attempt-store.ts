import type { AttemptLogPageResponse, JobAttemptDetailResponse, LogStream } from "@/lib/contracts/job-attempt";

/**
 * In-memory mock read model standing in for JobAttempt/AgentRun/CommandRun/
 * log projections described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-06.2.
 * Prototype-only data; no database or Spring service is involved.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

function snapshot(resourceVersion: string) {
  return {
    observedAt: new Date().toISOString(),
    requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
    resourceVersion,
  };
}

const CW1_TARGET = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-1";
const CW3_TARGET = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3";

function componentWorkJob(jobKey: string, targetHref: string) {
  const componentWorkKey = targetHref.split("/").at(-1) ?? "";

  return {
    jobKey,
    type: "component_work_implementation",
    jobApiHref: null,
    target: {
      type: "component_work",
      ref: componentWorkKey,
      apiHref: null,
      uiHref: targetHref,
      label: componentWorkKey,
    },
  };
}

const RICH: Record<string, JobAttemptDetailResponse> = {
  "ja-cw1-3": {
    attempt: {
      jobAttemptId: "ja-cw1-3",
      attemptNumber: 3,
      state: "failed",
      job: componentWorkJob("job-cw1", CW1_TARGET),
      worker: { workerKey: "worker-macos-3", href: null },
      lease: { leasedAt: iso(0, 2), expiresAt: iso(0, 1), lastHeartbeatAt: iso(0, 1) },
      timing: { startedAt: iso(0, 2), finishedAt: iso(0, 1), timeoutAt: iso(0, 1), durationMs: 3_412_000 },
      terminal: {
        exitCode: 1,
        signal: null,
        failureCode: "verification_command_failed",
        redactedSummary: "필수 검증 명령 4건 중 3건 실패 (마이그레이션 충돌)",
      },
      resultArtifactHref: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-diff",
      replacementAttemptHref: null,
      resourceVersion: "rv-ja-cw1-3",
    },
    agentRuns: [
      {
        agentRunId: "ar-cw1-3-1",
        role: "implementer",
        provider: "codex",
        modelIdentifier: "codex-agent-3",
        state: "completed",
        startedAt: iso(0, 2),
        finishedAt: iso(0, 1),
        outputArtifactHref: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-diff",
        href: "/runs/ja-cw1-3#agent-run-ar-cw1-3-1",
      },
    ],
    commandRuns: [
      {
        commandRunId: "cr-cw1-3-1",
        commandKey: "migrate:check",
        state: "failed",
        startedAt: iso(0, 1),
        finishedAt: iso(0, 1),
        exitCode: 1,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: true,
        href: "/runs/ja-cw1-3#command-run-cr-cw1-3-1",
      },
      {
        commandRunId: "cr-cw1-3-2",
        commandKey: "test:unit",
        state: "failed",
        startedAt: iso(0, 1),
        finishedAt: iso(0, 1),
        exitCode: 1,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: true,
        href: "/runs/ja-cw1-3#command-run-cr-cw1-3-2",
      },
      {
        commandRunId: "cr-cw1-3-3",
        commandKey: "lint",
        state: "passed",
        startedAt: iso(0, 1),
        finishedAt: iso(0, 1),
        exitCode: 0,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: false,
        href: "/runs/ja-cw1-3#command-run-cr-cw1-3-3",
      },
      {
        commandRunId: "cr-cw1-3-4",
        commandKey: "test:integration",
        state: "failed",
        startedAt: iso(0, 1),
        finishedAt: iso(0, 1),
        exitCode: 1,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: true,
        href: "/runs/ja-cw1-3#command-run-cr-cw1-3-4",
      },
    ],
    artifacts: [
      {
        artifactKey: "artifact-ja-cw1-3-diff",
        type: "implementation_diff",
        status: "available",
        redactionStatus: "not_required",
        byteSize: 8_420,
        href: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-diff",
      },
      {
        artifactKey: "artifact-ja-cw1-3-verification-summary",
        type: "verification_summary",
        status: "available",
        redactionStatus: "redacted",
        byteSize: 2_105,
        href: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-verification-summary",
      },
    ],
    snapshot: snapshot("rv-ja-cw1-3"),
    runnerDataAvailable: true,
  },
  "ja-cw3-1": {
    attempt: {
      jobAttemptId: "ja-cw3-1",
      attemptNumber: 1,
      state: "succeeded",
      job: componentWorkJob("job-cw3", CW3_TARGET),
      worker: { workerKey: "worker-macos-2", href: null },
      lease: { leasedAt: iso(1, 2), expiresAt: iso(1, 1), lastHeartbeatAt: iso(1, 1) },
      timing: { startedAt: iso(1, 2), finishedAt: iso(1, 1), timeoutAt: iso(1, 1), durationMs: 2_875_000 },
      terminal: { exitCode: 0, signal: null, failureCode: null, redactedSummary: "검증 3건 통과, PR #214 생성" },
      resultArtifactHref: "/projects/orion-billing/artifacts/artifact-ja-cw3-1-diff",
      replacementAttemptHref: null,
      resourceVersion: "rv-ja-cw3-1",
    },
    agentRuns: [
      {
        agentRunId: "ar-cw3-1-1",
        role: "implementer",
        provider: "codex",
        modelIdentifier: "codex-agent-1",
        state: "completed",
        startedAt: iso(1, 2),
        finishedAt: iso(1, 1),
        outputArtifactHref: "/projects/orion-billing/artifacts/artifact-ja-cw3-1-diff",
        href: "/runs/ja-cw3-1#agent-run-ar-cw3-1-1",
      },
    ],
    commandRuns: [
      {
        commandRunId: "cr-cw3-1-1",
        commandKey: "test:unit",
        state: "passed",
        startedAt: iso(1, 1),
        finishedAt: iso(1, 1),
        exitCode: 0,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: false,
        href: "/runs/ja-cw3-1#command-run-cr-cw3-1-1",
      },
      {
        commandRunId: "cr-cw3-1-2",
        commandKey: "lint",
        state: "passed",
        startedAt: iso(1, 1),
        finishedAt: iso(1, 1),
        exitCode: 0,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: false,
        href: "/runs/ja-cw3-1#command-run-cr-cw3-1-2",
      },
      {
        commandRunId: "cr-cw3-1-3",
        commandKey: "test:integration",
        state: "passed",
        startedAt: iso(1, 1),
        finishedAt: iso(1, 1),
        exitCode: 0,
        timedOut: false,
        stdoutAvailable: true,
        stderrAvailable: false,
        href: "/runs/ja-cw3-1#command-run-cr-cw3-1-3",
      },
    ],
    artifacts: [
      {
        artifactKey: "artifact-ja-cw3-1-diff",
        type: "implementation_diff",
        status: "available",
        redactionStatus: "not_required",
        byteSize: 3_190,
        href: "/projects/orion-billing/artifacts/artifact-ja-cw3-1-diff",
      },
    ],
    snapshot: snapshot("rv-ja-cw3-1"),
    runnerDataAvailable: true,
  },
};

interface FallbackAttemptSeed {
  jobAttemptId: string;
  attemptNumber: number;
  jobKey: string;
  targetHref: string;
  workerKey: string;
  startedAgo: number;
  replacementAttemptHref: string | null;
}

const FALLBACK_SEEDS: FallbackAttemptSeed[] = [
  {
    jobAttemptId: "ja-cw1-1",
    attemptNumber: 1,
    jobKey: "job-cw1",
    targetHref: CW1_TARGET,
    workerKey: "worker-linux-2",
    startedAgo: 10,
    replacementAttemptHref: "/runs/ja-cw1-2",
  },
  {
    jobAttemptId: "ja-cw1-2",
    attemptNumber: 2,
    jobKey: "job-cw1",
    targetHref: CW1_TARGET,
    workerKey: "worker-macos-1",
    startedAgo: 6,
    replacementAttemptHref: "/runs/ja-cw1-3",
  },
];

function buildFallbackDetail(seed: FallbackAttemptSeed): JobAttemptDetailResponse {
  const rv = `rv-${seed.jobAttemptId}`;
  return {
    attempt: {
      jobAttemptId: seed.jobAttemptId,
      attemptNumber: seed.attemptNumber,
      state: "failed",
      job: componentWorkJob(seed.jobKey, seed.targetHref),
      worker: { workerKey: seed.workerKey, href: null },
      lease: { leasedAt: iso(0, seed.startedAgo), expiresAt: iso(0, seed.startedAgo - 1), lastHeartbeatAt: iso(0, seed.startedAgo - 1) },
      timing: {
        startedAt: iso(0, seed.startedAgo),
        finishedAt: iso(0, seed.startedAgo - 1),
        timeoutAt: iso(0, seed.startedAgo - 1),
        durationMs: 3_000_000,
      },
      terminal: {
        exitCode: 1,
        signal: null,
        failureCode: "verification_command_failed",
        redactedSummary: `${seed.attemptNumber}번째 시도, 검증 실패`,
      },
      resultArtifactHref: null,
      replacementAttemptHref: seed.replacementAttemptHref,
      resourceVersion: rv,
    },
    agentRuns: [],
    commandRuns: [],
    artifacts: [],
    snapshot: snapshot(rv),
    runnerDataAvailable: true,
  };
}

export function getJobAttemptDetail(jobAttemptId: string): JobAttemptDetailResponse | null {
  const rich = RICH[jobAttemptId];
  if (rich) return rich;
  const seed = FALLBACK_SEEDS.find((s) => s.jobAttemptId === jobAttemptId);
  return seed ? buildFallbackDetail(seed) : null;
}

const LOG_ENTRIES: Record<string, Record<LogStream, AttemptLogPageResponse["entries"]>> = {
  "ja-cw1-3": {
    stdout: [
      { sequence: 1, occurredAt: iso(0, 2), level: "info", text: "[implementer] 재시도 큐 레코드 스키마 마이그레이션 작성 시작" },
      { sequence: 2, occurredAt: iso(0, 2), level: "info", text: "[implementer] migrations/0007_retry_queue_idempotency.sql 생성" },
      { sequence: 3, occurredAt: iso(0, 1), level: "info", text: "[verify] migrate:check 실행" },
      { sequence: 4, occurredAt: iso(0, 1), level: "error", text: "[verify] migrate:check 실패: 컬럼 idempotency_key 중복 제약 충돌" },
      { sequence: 5, occurredAt: iso(0, 1), level: "info", text: "[verify] test:unit 실행" },
      { sequence: 6, occurredAt: iso(0, 1), level: "error", text: "[verify] test:unit 실패: 3개 테스트 실패 (RetryQueueSchemaTest)" },
      { sequence: 7, occurredAt: iso(0, 1), level: "info", text: "[verify] lint 실행" },
      { sequence: 8, occurredAt: iso(0, 1), level: "info", text: "[verify] lint 통과" },
      { sequence: 9, occurredAt: iso(0, 1), level: "info", text: "[verify] test:integration 실행" },
      { sequence: 10, occurredAt: iso(0, 1), level: "error", text: "[verify] test:integration 실패: DB 연결 시점에 스키마 충돌" },
    ],
    stderr: [
      { sequence: 1, occurredAt: iso(0, 1), level: "error", text: "ERROR: duplicate key value violates unique constraint \"retry_queue_idempotency_key_idx\"" },
      { sequence: 2, occurredAt: iso(0, 1), level: "error", text: "FAIL RetryQueueSchemaTest.testIdempotencyKeyUniqueness (3 assertions failed)" },
    ],
    system: [
      { sequence: 1, occurredAt: iso(0, 2), level: "info", text: "Attempt leased by worker-macos-3" },
      { sequence: 2, occurredAt: iso(0, 1), level: "warn", text: "Attempt finished with non-zero exit code 1" },
    ],
  },
  "ja-cw3-1": {
    stdout: [
      { sequence: 1, occurredAt: iso(1, 2), level: "info", text: "[implementer] 정산 API 멱등성 키 리뷰 지적사항 반영 시작" },
      { sequence: 2, occurredAt: iso(1, 2), level: "info", text: "[implementer] services/billing-api/idempotency.py 수정" },
      { sequence: 3, occurredAt: iso(1, 1), level: "info", text: "[verify] test:unit 통과 (12/12)" },
      { sequence: 4, occurredAt: iso(1, 1), level: "info", text: "[verify] lint 통과" },
      { sequence: 5, occurredAt: iso(1, 1), level: "info", text: "[verify] test:integration 통과 (5/5)" },
      { sequence: 6, occurredAt: iso(1, 1), level: "info", text: "[pr] PR #214 생성됨" },
    ],
    stderr: [],
    system: [
      { sequence: 1, occurredAt: iso(1, 2), level: "info", text: "Attempt leased by worker-macos-2" },
      { sequence: 2, occurredAt: iso(1, 1), level: "info", text: "Attempt finished with exit code 0" },
    ],
  },
};

/** Cursor is just the next sequence number to start from; simple and sufficient for bounded mock logs. */
export function getAttemptLogPage(
  jobAttemptId: string,
  stream: LogStream,
  cursor: string | null,
): AttemptLogPageResponse | null {
  const byStream = LOG_ENTRIES[jobAttemptId];
  if (!byStream) return null;
  const all = byStream[stream] ?? [];
  const startSeq = cursor ? Number(cursor) : 1;
  const pageSize = 50;
  const page = all.filter((e) => e.sequence >= startSeq).slice(0, pageSize);
  const lastReturned = page.at(-1)?.sequence ?? startSeq - 1;
  const hasMore = all.some((e) => e.sequence > lastReturned);

  return {
    attemptId: jobAttemptId,
    stream,
    entries: page,
    nextCursor: hasMore ? String(lastReturned + 1) : null,
    newestSequence: all.at(-1)?.sequence ?? 0,
    redaction: { applied: false, omittedEntryCount: 0, reasonCode: null },
  };
}
