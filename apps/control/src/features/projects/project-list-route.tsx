"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./project-list-route.module.css";
import { ProjectFilterControls, type ProjectFilterValue } from "./project-filter-controls";
import { ProjectAttentionSummary } from "./project-attention-summary";
import { ProjectListTable } from "./project-list-table";
import { ProjectListCards } from "./project-list-cards";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { EmptyState, ErrorState, StaleBanner } from "@/components/StateViews";
import { formatAbsoluteTime } from "@/lib/format";
import {
  createInitialProjectListState,
  projectListReducer,
} from "./project-list-state";
import type {
  ProjectAttentionFilter,
  ProjectListResponse,
  ProjectSort,
  SortDirection,
} from "@/lib/contracts/projects";

function readFilterFromParams(params: URLSearchParams): ProjectFilterValue {
  const sort = (params.get("sort") as ProjectSort) || "attention";
  return {
    q: params.get("q") ?? "",
    attention: params.getAll("attention") as ProjectAttentionFilter[],
    sort,
    direction: (params.get("direction") as SortDirection) || (sort === "name" ? "asc" : "desc"),
  };
}

function filterToUrlSearch(filter: ProjectFilterValue): string {
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  for (const a of filter.attention) params.append("attention", a);
  if (filter.sort !== "attention") params.set("sort", filter.sort);
  const defaultDirection = filter.sort === "name" ? "asc" : "desc";
  if (filter.direction !== defaultDirection) params.set("direction", filter.direction);
  const s = params.toString();
  return s ? `?${s}` : "";
}

function filterToApiSearch(filter: ProjectFilterValue, cursor?: string | null): string {
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  for (const a of filter.attention) params.append("attention", a);
  params.set("sort", filter.sort);
  params.set("direction", filter.direction);
  if (cursor) params.set("cursor", cursor);
  return params.toString();
}

interface ProjectListRouteProps {
  initialResponse: ProjectListResponse | null;
  initialErrorRequestId?: string | null;
}

export function ProjectListRoute({ initialResponse, initialErrorRequestId }: ProjectListRouteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = useMemo(() => readFilterFromParams(searchParams), [searchParams]);

  const [state, dispatch] = useReducer(projectListReducer, undefined, () => {
    const init = createInitialProjectListState();
    if (initialResponse) {
      return projectListReducer(init, { type: "fetch_success", response: initialResponse, append: false });
    }
    return { ...init, phase: "error_without_data" as const, errorRequestId: initialErrorRequestId ?? null, errorMessage: "초기 스냅샷을 불러오지 못했습니다." };
  });

  const requestSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const hasSnapshotRef = useRef(Boolean(initialResponse));

  const fetchPage = useCallback(
    async (mode: "refresh" | "load_more", cursor?: string | null) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const seq = ++requestSeq.current;

      dispatch({ type: "fetch_start", mode });
      try {
        const res = await fetch(`/api/mock/projects?${filterToApiSearch(filter, cursor)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (seq !== requestSeq.current) return;
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          dispatch({
            type: "fetch_error",
            requestId: body?.error?.code ?? null,
            message: body?.error?.message ?? "요청을 처리할 수 없습니다.",
            hadData: hasSnapshotRef.current,
          });
          return;
        }
        const body = (await res.json()) as ProjectListResponse;
        hasSnapshotRef.current = true;
        dispatch({ type: "fetch_success", response: body, append: mode === "load_more" });
      } catch (err) {
        if (controller.signal.aborted) return;
        dispatch({
          type: "fetch_error",
          requestId: null,
          message: err instanceof Error ? err.message : "네트워크 오류",
          hadData: hasSnapshotRef.current,
        });
      }
    },
    [filter],
  );

  // Refetch the first page whenever the URL-derived filter changes (after mount).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    void fetchPage("refresh", null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.q, filter.attention.join(","), filter.sort, filter.direction]);

  function updateFilter(next: Partial<ProjectFilterValue>) {
    router.replace(`/projects${filterToUrlSearch({ ...filter, ...next })}`);
  }

  // Remounts ProjectFilterControls only on an explicit reset, so its local
  // search draft clears without needing to sync from props on every render.
  const [resetToken, setResetToken] = useState(0);
  function resetFilters() {
    setResetToken((t) => t + 1);
    router.replace("/projects");
  }

  const items = state.order.map((key) => state.itemsByProjectKey[key]).filter(Boolean);
  const isFiltered = Boolean(filter.q || filter.attention.length > 0);
  const disabled = state.phase === "initial_loading";

  return (
    <div>
      <p className={styles.breadcrumb}>ADO Control Room</p>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Projects</h1>
          {state.summary ? (
            <span className={styles.resultCount}>{state.summary.totalCount}건</span>
          ) : null}
        </div>
        {state.observedAt ? (
          <span className={styles.snapshotTime}>
            마지막 확인: {formatAbsoluteTime(state.observedAt)}
            {state.phase === "refreshing" ? " · 새로고침 중" : ""}
          </span>
        ) : null}
      </div>

      <ProjectFilterControls
        key={resetToken}
        value={filter}
        disabled={disabled}
        onSearchChange={(q) => updateFilter({ q })}
        onAttentionChange={(attention) => updateFilter({ attention })}
        onSortChange={(sort, direction) => updateFilter({ sort, direction })}
        onReset={resetFilters}
      />

      {state.phase === "error_without_data" ? (
        <ErrorState
          title={state.errorMessage ?? "Project 목록을 불러오지 못했습니다."}
          requestId={state.errorRequestId ?? "unknown"}
          onRetry={() => fetchPage("refresh", null)}
        />
      ) : null}

      {state.phase === "error_with_stale_data" ? (
        <StaleBanner observedAtLabel={state.observedAt ? formatAbsoluteTime(state.observedAt) : "-"} onRetry={() => fetchPage("refresh", null)} />
      ) : null}

      {state.phase === "initial_loading" ? (
        <div aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <Skeleton height="18px" />
              <Skeleton height="18px" />
              <Skeleton height="18px" />
              <Skeleton height="18px" />
              <Skeleton height="18px" />
            </div>
          ))}
        </div>
      ) : null}

      {state.phase !== "initial_loading" && state.summary ? (
        <ProjectAttentionSummary summary={state.summary} />
      ) : null}

      {state.phase !== "initial_loading" &&
      state.phase !== "error_without_data" &&
      state.phase !== "error_with_stale_data" &&
      items.length === 0 ? (
        <EmptyState title={isFiltered ? "조건에 맞는 Project가 없습니다." : "등록된 Project가 없습니다."}>
          {isFiltered ? (
            <Button variant="ghost" onClick={resetFilters}>
              필터 초기화
            </Button>
          ) : null}
        </EmptyState>
      ) : null}

      {items.length > 0 ? (
        <>
          <div className="ado-show-desktop-table">
            <ProjectListTable
              items={items}
              sort={filter.sort}
              direction={filter.direction}
              onSortHeaderClick={(sort) => updateFilter({ sort, direction: filter.sort === sort && filter.direction === "desc" ? "asc" : "desc" })}
              captionText={`Project 목록, ${items.length}건 표시 중${isFiltered ? " (필터 적용됨)" : ""}`}
            />
          </div>
          <div className="ado-show-mobile-cards">
            <ProjectListCards items={items} />
          </div>

          {state.phase === "loading_more" ? (
            <div aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                  <Skeleton height="18px" />
                  <Skeleton height="18px" />
                  <Skeleton height="18px" />
                  <Skeleton height="18px" />
                  <Skeleton height="18px" />
                </div>
              ))}
            </div>
          ) : null}

          <div className={styles.footer}>
            {state.nextCursor ? (
              <Button variant="secondary" onClick={() => fetchPage("load_more", state.nextCursor)} disabled={state.phase === "loading_more"}>
                더 보기
              </Button>
            ) : (
              <p className={styles.endOfResults}>모든 결과를 표시했습니다.</p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
