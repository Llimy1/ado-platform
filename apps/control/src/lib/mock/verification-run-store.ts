import type { VerificationRunDetailResponse } from "@/lib/contracts/verification-run";

/**
 * In-memory mock read model standing in for the VerificationRun projection
 * described in ADO/CONTROL_ROOM_PAGE_SPECS.md P-07.2. Prototype-only data;
 * no database or Spring service is involved.
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

const CW1_HREF = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-1";
const CW3_HREF = "/projects/orion-billing/roadmaps/rm-01/feature-units/fu-orion-402/component-works/cw-orion-3";

const RUNS: Record<string, VerificationRunDetailResponse> = {
  "vr-cw1-3": {
    verificationRun: {
      verificationRunId: "vr-cw1-3",
      componentWorkHref: CW1_HREF,
      componentWorkTitle: "재시도 큐 레코드 스키마",
      gitSnapshot: { commitId: "e4f5g6h", treeId: "t-9a8b7c", baseCommitId: "a1b2c3d" },
      verificationProfile: { key: "billing-worker-default", version: "v2" },
      specLibrary: { revision: "spec-v0.1.0", manifestHash: "a1d4995e" },
      startedAt: iso(0, 2),
      finishedAt: iso(0, 1),
      state: "failed",
      requiredPassed: false,
      evidenceGate: {
        result: "rejected",
        reasonCode: "required_command_failed",
        href: "/projects/orion-billing/incidents/inc-501",
      },
    },
    commands: [
      {
        commandRunId: "cr-cw1-3-1",
        commandKey: "migrate:check",
        required: true,
        state: "failed",
        expectedExitCodes: [0],
        actualExitCode: 1,
        signal: null,
        timedOut: false,
        durationMs: 4_200,
        outputHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-1",
        evidenceHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-1",
      },
      {
        commandRunId: "cr-cw1-3-2",
        commandKey: "test:unit",
        required: true,
        state: "failed",
        expectedExitCodes: [0],
        actualExitCode: 1,
        signal: null,
        timedOut: false,
        durationMs: 18_900,
        outputHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-2",
        evidenceHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-2",
      },
      {
        commandRunId: "cr-cw1-3-3",
        commandKey: "lint",
        required: true,
        state: "passed",
        expectedExitCodes: [0],
        actualExitCode: 0,
        signal: null,
        timedOut: false,
        durationMs: 3_100,
        outputHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-3",
        evidenceHref: null,
      },
      {
        commandRunId: "cr-cw1-3-4",
        commandKey: "test:integration",
        required: true,
        state: "failed",
        expectedExitCodes: [0],
        actualExitCode: 1,
        signal: null,
        timedOut: false,
        durationMs: 41_500,
        outputHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-4",
        evidenceHref: "/runs/ja-cw1-3#command-run-cr-cw1-3-4",
      },
    ],
    artifacts: [
      {
        artifactKey: "artifact-ja-cw1-3-verification-summary",
        type: "verification_summary",
        href: "/projects/orion-billing/artifacts/artifact-ja-cw1-3-verification-summary",
      },
    ],
    snapshot: snapshot("rv-vr-cw1-3"),
  },
  "vr-cw3-1": {
    verificationRun: {
      verificationRunId: "vr-cw3-1",
      componentWorkHref: CW3_HREF,
      componentWorkTitle: "PR 리뷰 반영",
      gitSnapshot: { commitId: "f0a1b2c", treeId: "t-3d4e5f", baseCommitId: "b7c8d9e" },
      verificationProfile: { key: "billing-api-default", version: "v2" },
      specLibrary: { revision: "spec-v0.1.0", manifestHash: "a1d4995e" },
      startedAt: iso(1, 2),
      finishedAt: iso(1, 1),
      state: "passed",
      requiredPassed: true,
      evidenceGate: { result: "accepted", reasonCode: "all_required_commands_passed", href: null },
    },
    commands: [
      {
        commandRunId: "cr-cw3-1-1",
        commandKey: "test:unit",
        required: true,
        state: "passed",
        expectedExitCodes: [0],
        actualExitCode: 0,
        signal: null,
        timedOut: false,
        durationMs: 16_200,
        outputHref: "/runs/ja-cw3-1#command-run-cr-cw3-1-1",
        evidenceHref: null,
      },
      {
        commandRunId: "cr-cw3-1-2",
        commandKey: "lint",
        required: true,
        state: "passed",
        expectedExitCodes: [0],
        actualExitCode: 0,
        signal: null,
        timedOut: false,
        durationMs: 2_800,
        outputHref: "/runs/ja-cw3-1#command-run-cr-cw3-1-2",
        evidenceHref: null,
      },
      {
        commandRunId: "cr-cw3-1-3",
        commandKey: "test:integration",
        required: true,
        state: "passed",
        expectedExitCodes: [0],
        actualExitCode: 0,
        signal: null,
        timedOut: false,
        durationMs: 33_400,
        outputHref: "/runs/ja-cw3-1#command-run-cr-cw3-1-3",
        evidenceHref: null,
      },
    ],
    artifacts: [],
    snapshot: snapshot("rv-vr-cw3-1"),
  },
};

export function getVerificationRunDetail(verificationRunId: string): VerificationRunDetailResponse | null {
  return RUNS[verificationRunId] ?? null;
}
