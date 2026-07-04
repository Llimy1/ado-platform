import styles from "./component-work-scope-panel.module.css";
import { Panel } from "@/components/Panel";
import { MachineValue } from "@/components/MachineValue";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

const ROLE_LABEL: Record<string, string> = {
  primary: "주 컴포넌트",
  contributing: "기여",
  shared_contract: "공유 계약",
};

/**
 * P-05.4 scope/repository panel. Never renders a local absolute worktree
 * path as a clickable filesystem affordance — only the redacted remote URL,
 * branch names, and commit identifiers.
 */
export function ComponentWorkScopePanel({ work }: { work: ComponentWorkDetailResponse["work"] }) {
  return (
    <Panel title="범위 및 저장소" headingId="component-work-scope-heading">
      <ul className={styles.list}>
        {work.scopes.map((s) => (
          <li key={s.componentKey} className={styles.row}>
            <span>
              {s.displayName}
              <span className={styles.rootPath}> · {s.relativeRoot}</span>
            </span>
            <span>
              {ROLE_LABEL[s.role] ?? s.role}
              {s.required ? "" : " · 선택"}
            </span>
          </li>
        ))}
      </ul>
      <dl className={styles.kvGrid}>
        <div>
          <span className={styles.kvLabel}>저장소</span>
          <span className="ado-mono">{work.repository.remoteUrlRedacted}</span>
        </div>
        <div>
          <span className={styles.kvLabel}>integration branch</span>
          <span className="ado-mono">{work.repository.integrationBranch}</span>
        </div>
        <div>
          <span className={styles.kvLabel}>base branch</span>
          <span className="ado-mono">{work.repository.baseBranch}</span>
        </div>
        <div>
          <span className={styles.kvLabel}>head branch</span>
          {work.repository.headBranch ? <span className="ado-mono">{work.repository.headBranch}</span> : "없음"}
        </div>
        {work.worktree ? (
          <>
            <div>
              <span className={styles.kvLabel}>worktree</span>
              <MachineValue value={work.worktree.worktreeKey} label="worktreeKey" />
            </div>
            <div>
              <span className={styles.kvLabel}>worktree 상태</span>
              {work.worktree.status}
            </div>
          </>
        ) : null}
        <div>
          <span className={styles.kvLabel}>허용 경로 규칙</span>
          {work.allowedPaths.version} · {work.allowedPaths.writeRuleCount}건
        </div>
      </dl>
    </Panel>
  );
}
