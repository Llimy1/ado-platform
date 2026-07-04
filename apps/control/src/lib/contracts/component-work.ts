/**
 * Mirrors GET .../component-works/{componentWorkKey} from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-05.2/P-05.3. Hand-maintained
 * UI-prototype types; see note in ./projects.ts.
 */

export type ComponentWorkCommand = "pause" | "resume" | "retry" | "cancel" | "request_pr";

export interface ComponentWorkDetailResponse {
  work: {
    componentWorkKey: string;
    title: string;
    intent: string;
    state: string;
    riskLevel: string;
    executionScope: "single" | "coordinated";
    required: boolean;
    primaryComponent: { key: string; displayName: string };
    scopes: Array<{
      componentKey: string;
      displayName: string;
      relativeRoot: string;
      role: "primary" | "contributing" | "shared_contract";
      required: boolean;
    }>;
    repository: {
      remoteUrlRedacted: string;
      integrationBranch: string;
      baseBranch: string;
      headBranch: string | null;
    };
    worktree: { worktreeKey: string; status: string; baseCommit: string | null; headCommit: string | null } | null;
    allowedPaths: { version: string; writeRuleCount: number; href: string | null };
    resourceVersion: string;
  };
  commandGate: {
    paused: boolean;
    pauseReason: string | null;
    allowedActions: ComponentWorkCommand[];
    actionRequirements: Record<
      string,
      {
        expectedResourceVersion: string;
        reasonRequired: boolean;
        confirmation: "none" | "dialog" | "destructive_dialog";
      }
    >;
  };
  activeExecution: {
    jobAttemptId: string | null;
    jobKey: string | null;
    state: "none" | "queued" | "leased" | "running" | "timed_out" | "failed" | "human_required";
    runnerLabel: string | null;
    startedAt: string | null;
    timeoutAt: string | null;
    lastHeartbeatAt: string | null;
    href: string | null;
  };
  verification: {
    state: "not_started" | "running" | "passed" | "failed" | "blocked";
    latestVerificationRunId: string | null;
    requiredCommandCount: number;
    passedCommandCount: number;
    failedCommandCount: number;
    href: string | null;
  };
  review: {
    state:
      | "not_started"
      | "local_running"
      | "local_completed"
      | "arbiter_running"
      | "passed"
      | "changes_requested"
      | "human_required";
    reviewGroupId: string | null;
    acceptedP0P1FindingCount: number;
    unresolvedFindingCount: number;
    href: string | null;
  };
  pullRequest: {
    pullRequestId: string;
    url: string;
    baseBranch: string;
    headBranch: string;
    status: string;
    createdAt: string;
  } | null;
  attempts: {
    items: Array<{
      jobAttemptId: string;
      attemptNumber: number;
      state: string;
      workerLabel: string | null;
      startedAt: string | null;
      finishedAt: string | null;
      timeoutAt: string | null;
      failureCode: string | null;
      redactedSummary: string | null;
      href: string;
    }>;
    omittedCount: number;
  };
  timeline: {
    items: Array<{ eventKey: string; occurredAt: string; summary: string; evidenceHref: string | null }>;
    omittedCount: number;
  };
  snapshot: { observedAt: string; requestId: string; resourceVersion: string };
}

/** POST .../component-works/{componentWorkKey}/commands/{command} request body. Not wired to any backend in this prototype. */
export interface ComponentWorkCommandRequest {
  expectedResourceVersion: string;
  reason?: string;
}
