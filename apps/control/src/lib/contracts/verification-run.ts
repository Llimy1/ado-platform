/**
 * Mirrors GET /v1/verification-runs/{verificationRunId} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-07.2. Hand-maintained UI-prototype
 * types; see note in ./projects.ts. Read-only — no commands exist on this
 * route.
 */

export type VerificationState = "not_started" | "running" | "passed" | "failed" | "timed_out" | "blocked" | "evidence_invalid";

export interface VerificationRunDetailResponse {
  verificationRun: {
    verificationRunId: string;
    componentWorkHref: string;
    componentWorkTitle: string;
    gitSnapshot: { commitId: string; treeId: string; baseCommitId: string };
    verificationProfile: { key: string; version: string };
    specLibrary: { revision: string; manifestHash: string };
    startedAt: string;
    finishedAt: string | null;
    state: VerificationState;
    requiredPassed: boolean;
    evidenceGate: { result: string; reasonCode: string; href: string | null };
  };
  commands: Array<{
    commandRunId: string;
    commandKey: string;
    required: boolean;
    state: VerificationState;
    expectedExitCodes: number[];
    actualExitCode: number | null;
    signal: string | null;
    timedOut: boolean;
    durationMs: number | null;
    outputHref: string | null;
    evidenceHref: string | null;
  }>;
  artifacts: Array<{ artifactKey: string; type: string; href: string | null }>;
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}
