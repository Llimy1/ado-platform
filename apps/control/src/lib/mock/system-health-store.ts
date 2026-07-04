import type { SystemHealthResponse } from "@/lib/contracts/system-health";

/**
 * In-memory mock read model standing in for GET /v1/health plus the
 * authorized Worker/queue projection described in
 * ADO/CONTROL_ROOM_PAGE_SPECS.md P-10.2. Worker states mirror the exact
 * semantics in ADO/WORKER_OPERATIONS.md §4.2. Global surface, no project
 * scoping — reuses the same worker labels already referenced from
 * component-work-store's attempt history.
 */

function iso(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(d.getUTCHours() - hours);
  return d.toISOString();
}

export function getSystemHealth(): SystemHealthResponse {
  return {
    api: { ready: true, version: "v1.42.0" },
    database: { connected: true, latencyMs: 8 },
    outbox: { lagSeconds: 4, pendingCount: 12 },
    workers: {
      items: [
        { workerKey: "worker-macos-1", labels: ["macos", "xcode-16"], runtimeVersion: "0.9.3", state: "ready", lastHeartbeatAt: iso(0, 0), activeAttempt: null },
        { workerKey: "worker-macos-2", labels: ["macos", "xcode-16"], runtimeVersion: "0.9.3", state: "ready", lastHeartbeatAt: iso(0, 0), activeAttempt: null },
        { workerKey: "worker-macos-3", labels: ["macos", "xcode-16"], runtimeVersion: "0.9.2", state: "stale", lastHeartbeatAt: iso(0, 3), activeAttempt: null },
        { workerKey: "worker-linux-1", labels: ["linux", "gpu"], runtimeVersion: "0.9.3", state: "offline", lastHeartbeatAt: iso(1, 2), activeAttempt: null },
        { workerKey: "worker-linux-2", labels: ["linux"], runtimeVersion: "0.9.3", state: "ready", lastHeartbeatAt: iso(0, 0), activeAttempt: null },
      ],
      readyCount: 3,
      degradedCount: 2,
    },
    activeLeaseCount: 0,
    openIncidentCount: 1,
    snapshot: { observedAt: new Date().toISOString(), requestId: `req_${Math.random().toString(36).slice(2, 10)}` },
  };
}
