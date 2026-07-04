/**
 * Mirrors GET /v1/health plus the authorized Worker/queue projection from
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.2. Worker state values are exactly
 * those in ADO/WORKER_OPERATIONS.md §4.2 — the UI never invents a second
 * source of truth. Hand-maintained UI-prototype types; see note in
 * ./projects.ts.
 */

export type WorkerHealthState = "starting" | "ready" | "busy" | "draining" | "stale" | "offline" | "blocked";

export interface SystemHealthResponse {
  api: { ready: boolean; version: string };
  database: { connected: boolean; latencyMs: number | null };
  outbox: { lagSeconds: number; pendingCount: number };
  workers: {
    items: Array<{
      workerKey: string;
      labels: string[];
      runtimeVersion: string;
      state: WorkerHealthState;
      lastHeartbeatAt: string | null;
      activeAttempt: { jobAttemptId: string; href: string } | null;
    }>;
    readyCount: number;
    degradedCount: number;
  };
  activeLeaseCount: number;
  openIncidentCount: number;
  snapshot: { observedAt: string; requestId: string };
}
