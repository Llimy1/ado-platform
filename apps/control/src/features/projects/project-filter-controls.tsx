"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./project-filter-controls.module.css";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import type { ProjectAttentionFilter, ProjectSort, SortDirection } from "@/lib/contracts/projects";

const ATTENTION_OPTIONS: Array<{ value: ProjectAttentionFilter; label: string }> = [
  { value: "action_required", label: "사람 판단 필요" },
  { value: "blocked", label: "차단됨" },
  { value: "incident_hold", label: "사고 보류" },
];

const SORT_OPTIONS: Array<{ value: ProjectSort; label: string }> = [
  { value: "attention", label: "주의 필요 우선" },
  { value: "activity", label: "최근 활동 순" },
  { value: "name", label: "이름순" },
];

export interface ProjectFilterValue {
  q: string;
  attention: ProjectAttentionFilter[];
  sort: ProjectSort;
  direction: SortDirection;
}

interface ProjectFilterControlsProps {
  value: ProjectFilterValue;
  onSearchChange: (q: string) => void;
  onAttentionChange: (attention: ProjectAttentionFilter[]) => void;
  onSortChange: (sort: ProjectSort, direction: SortDirection) => void;
  onReset: () => void;
  disabled?: boolean;
}

function toggleAttention(
  current: ProjectAttentionFilter[],
  value: ProjectAttentionFilter,
): ProjectAttentionFilter[] {
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

/**
 * P-01.3 / P-01.6: desktop controls apply immediately through the URL;
 * the mobile control opens a modal that only applies on 적용.
 */
export function ProjectFilterControls({
  value,
  onSearchChange,
  onAttentionChange,
  onSortChange,
  onReset,
  disabled,
}: ProjectFilterControlsProps) {
  const [searchDraft, setSearchDraft] = useState(value.q);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDraft, setMobileDraft] = useState<ProjectFilterValue>(value);

  function resetAll() {
    setSearchDraft("");
    onReset();
  }

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (searchDraft !== value.q) onSearchChangeRef.current(searchDraft);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchDraft, value.q]);

  function openMobileFilters() {
    setMobileDraft(value);
    setMobileOpen(true);
  }

  function applyMobileFilters() {
    onAttentionChange(mobileDraft.attention);
    onSortChange(mobileDraft.sort, mobileDraft.direction);
    setMobileOpen(false);
  }

  function resetMobileFilters() {
    setMobileDraft({ q: value.q, attention: [], sort: "attention", direction: "desc" });
  }

  return (
    <div className={styles.bar}>
      <div className={styles.searchField}>
        <label className={styles.label} htmlFor="project-search">
          Project 검색
        </label>
        <input
          id="project-search"
          type="search"
          className={styles.input}
          placeholder="이름, projectKey, 설명으로 검색"
          value={searchDraft}
          disabled={disabled}
          onChange={(e) => setSearchDraft(e.target.value)}
        />
      </div>

      <div className={styles.desktopOnly}>
        <fieldset className={styles.fieldset} style={{ marginBottom: 0 }}>
          <legend className={styles.legend}>주의 필터</legend>
          <div className={styles.checkboxGroup} style={{ flexDirection: "row" }}>
            {ATTENTION_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={value.attention.includes(opt.value)}
                  disabled={disabled}
                  onChange={() => onAttentionChange(toggleAttention(value.attention, opt.value))}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={styles.label} htmlFor="project-sort">
            정렬
          </label>
          <select
            id="project-sort"
            className={styles.select}
            value={value.sort}
            disabled={disabled}
            onChange={(e) => onSortChange(e.target.value as ProjectSort, value.direction)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label} htmlFor="project-direction">
            방향
          </label>
          <select
            id="project-direction"
            className={styles.select}
            value={value.direction}
            disabled={disabled}
            onChange={(e) => onSortChange(value.sort, e.target.value as SortDirection)}
          >
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>

        <Button variant="ghost" dense onClick={resetAll} disabled={disabled}>
          필터 초기화
        </Button>
      </div>

      <Button variant="secondary" dense className={styles.mobileOnly} onClick={openMobileFilters} disabled={disabled}>
        필터
      </Button>

      <Dialog open={mobileOpen} onClose={() => setMobileOpen(false)} title="Project 필터">
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>주의 필터</legend>
          <div className={styles.checkboxGroup}>
            {ATTENTION_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={mobileDraft.attention.includes(opt.value)}
                  onChange={() =>
                    setMobileDraft((prev) => ({ ...prev, attention: toggleAttention(prev.attention, opt.value) }))
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ marginBottom: "var(--ado-space-4)" }}>
          <label className={styles.label} htmlFor="mobile-sort">
            정렬
          </label>
          <select
            id="mobile-sort"
            className={styles.select}
            value={mobileDraft.sort}
            onChange={(e) => setMobileDraft((prev) => ({ ...prev, sort: e.target.value as ProjectSort }))}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formActions}>
          <Button variant="ghost" onClick={resetMobileFilters}>
            초기화
          </Button>
          <Button variant="primary" onClick={applyMobileFilters}>
            적용
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
