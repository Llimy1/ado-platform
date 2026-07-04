import Link from "next/link";
import panelStyles from "./overview-panels.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAbsoluteTime } from "@/lib/format";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

const TARGET_TYPE_LABEL: Record<string, string> = {
  feature_unit: "Feature Unit",
  component_work: "Component Work",
  incident: "사고",
  configuration: "설정",
};

/** P-02.5 Pending Human Decisions: no approve/reject controls here by design. */
export function PendingDecisionList({
  decisionQueue,
}: {
  decisionQueue: ProjectOverviewResponse["decisionQueue"];
}) {
  return (
    <Panel title="보류 중인 결정" headingId="pending-decisions-heading">
      {decisionQueue.items.length === 0 ? (
        <EmptyState title="보류 중인 결정이 없습니다." />
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {decisionQueue.items.map((d) => (
            <li key={d.decisionKey} className={panelStyles.row}>
              <div className={panelStyles.stack}>
                <span className={panelStyles.itemTitle}>{d.title}</span>
                <span className={panelStyles.itemMeta}>
                  {TARGET_TYPE_LABEL[d.targetType] ?? d.targetType} · 요청 {formatAbsoluteTime(d.requestedAt)}
                </span>
              </div>
              <StatusBadge tone={d.severity === "critical" ? "failure" : "warning"} label={d.severity === "critical" ? "긴급" : "주의"} />
              <Link href={d.href}>검토하기</Link>
            </li>
          ))}
        </ul>
      )}
      {decisionQueue.totalPendingCount > decisionQueue.items.length ? (
        <p className={panelStyles.footerLink}>
          그 외 {decisionQueue.totalPendingCount - decisionQueue.items.length}건 더 있음 · Human Decision Inbox 준비 중
        </p>
      ) : null}
    </Panel>
  );
}
