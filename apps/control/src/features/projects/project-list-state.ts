import type { ProjectListItem, ProjectListResponse } from "@/lib/contracts/projects";

/** Exactly the display phases enumerated in P-01.3 that this prototype uses (no SSE, so no "disconnected" phase). */
export type ProjectListPhase =
  | "initial_loading"
  | "ready"
  | "refreshing"
  | "loading_more"
  | "error_without_data"
  | "error_with_stale_data";

export interface ProjectListState {
  phase: ProjectListPhase;
  itemsByProjectKey: Record<string, ProjectListItem>;
  order: string[];
  nextCursor: string | null;
  summary: ProjectListResponse["summary"] | null;
  observedAt: string | null;
  errorRequestId: string | null;
  errorMessage: string | null;
}

export function createInitialProjectListState(): ProjectListState {
  return {
    phase: "initial_loading",
    itemsByProjectKey: {},
    order: [],
    nextCursor: null,
    summary: null,
    observedAt: null,
    errorRequestId: null,
    errorMessage: null,
  };
}

export type ProjectListAction =
  | { type: "fetch_start"; mode: "initial" | "refresh" | "load_more" }
  | { type: "fetch_success"; response: ProjectListResponse; append: boolean }
  | { type: "fetch_error"; requestId: string | null; message: string; hadData: boolean };

export function projectListReducer(
  state: ProjectListState,
  action: ProjectListAction,
): ProjectListState {
  switch (action.type) {
    case "fetch_start": {
      if (action.mode === "initial") return { ...state, phase: "initial_loading" };
      if (action.mode === "load_more") return { ...state, phase: "loading_more" };
      return { ...state, phase: "refreshing" };
    }
    case "fetch_success": {
      const nextItemsByKey = action.append ? { ...state.itemsByProjectKey } : {};
      const nextOrder = action.append ? [...state.order] : [];
      for (const item of action.response.items) {
        if (!(item.projectKey in nextItemsByKey)) nextOrder.push(item.projectKey);
        nextItemsByKey[item.projectKey] = item;
      }
      return {
        ...state,
        phase: "ready",
        itemsByProjectKey: nextItemsByKey,
        order: nextOrder,
        nextCursor: action.response.page.nextCursor,
        summary: action.response.summary,
        observedAt: action.response.snapshot.observedAt,
        errorRequestId: null,
        errorMessage: null,
      };
    }
    case "fetch_error": {
      return {
        ...state,
        phase: action.hadData ? "error_with_stale_data" : "error_without_data",
        errorRequestId: action.requestId,
        errorMessage: action.message,
      };
    }
    default:
      return state;
  }
}
