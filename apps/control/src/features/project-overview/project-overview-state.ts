export type ProjectOverviewPhase =
  | "initial_loading"
  | "ready"
  | "stale"
  | "error_with_snapshot"
  | "error_without_snapshot"
  | "denied";
