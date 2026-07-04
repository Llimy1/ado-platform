import styles from "./component-work-scope-panel.module.css";
import { Panel } from "@/components/Panel";
import { formatAbsoluteTime } from "@/lib/format";
import type { ComponentWorkDetailResponse } from "@/lib/contracts/component-work";

/** P-05.4: PR evidence summary, never a merge button. */
export function PullRequestPanel({ pullRequest }: { pullRequest: NonNullable<ComponentWorkDetailResponse["pullRequest"]> }) {
  return (
    <Panel title="Pull Request" headingId="pull-request-panel-heading">
      <dl className={styles.kvGrid}>
        <div>
          <span className={styles.kvLabel}>PR</span>
          <a href={pullRequest.url} target="_blank" rel="noreferrer noopener">
            {pullRequest.pullRequestId}
          </a>
        </div>
        <div>
          <span className={styles.kvLabel}>상태</span>
          {pullRequest.status}
        </div>
        <div>
          <span className={styles.kvLabel}>base → head</span>
          <span className="ado-mono">
            {pullRequest.baseBranch} ← {pullRequest.headBranch}
          </span>
        </div>
        <div>
          <span className={styles.kvLabel}>생성 시각</span>
          {formatAbsoluteTime(pullRequest.createdAt)}
        </div>
      </dl>
    </Panel>
  );
}
