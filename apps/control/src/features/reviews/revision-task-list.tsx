import Link from "next/link";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import type { ReviewGroupDetailResponse } from "@/lib/contracts/review-group";

/** P-07.3: RevisionTasks link accepted findings to the recovery work item. */
export function RevisionTaskList({ tasks }: { tasks: ReviewGroupDetailResponse["revisionTasks"] }) {
  return (
    <Panel title="RevisionTask" headingId="revision-task-list-heading">
      {tasks.length === 0 ? (
        <EmptyState title="등록된 RevisionTask가 없습니다." />
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--ado-space-2)" }}>
          {tasks.map((t) => (
            <li
              key={t.revisionTaskKey}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--ado-space-2)",
                minHeight: "var(--ado-row-passive)",
                borderBottom: "1px solid var(--ado-color-border)",
                fontSize: "var(--ado-text-dense-size)",
              }}
            >
              <Link href={t.href}>{t.title}</Link>
              <StatusBadge tone={LIFECYCLE_STATE_TONE[t.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[t.state] ?? t.state} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
