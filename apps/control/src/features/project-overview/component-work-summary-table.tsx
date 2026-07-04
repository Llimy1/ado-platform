import Link from "next/link";
import panelStyles from "./overview-panels.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { StatusBadge, type StatusTone } from "@/components/StatusBadge";
import { formatRelativeTime, formatAbsoluteTime } from "@/lib/format";
import type { ProjectOverviewResponse } from "@/lib/contracts/project-overview";

const STATE_LABEL: Record<string, string> = {
  blocked: "차단됨",
  needs_revision: "검토 필요",
  pr_created: "완료",
  running: "실행 중",
  queued: "대기",
};

const STATE_TONE: Record<string, StatusTone> = {
  blocked: "failure",
  needs_revision: "warning",
  pr_created: "success",
  running: "running",
  queued: "queued",
};

/** P-02.5 Component Work Table: overview sample, not the complete inventory. */
export function ComponentWorkSummaryTable({
  componentWork,
}: {
  componentWork: ProjectOverviewResponse["componentWork"];
}) {
  return (
    <Panel title="Component Work" headingId="component-work-heading">
      {componentWork.items.length === 0 ? (
        <EmptyState title="열린 Component Work가 없습니다." />
      ) : (
        <div className={panelStyles.tableWrap}>
          <table className={panelStyles.table}>
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Work</th>
                <th scope="col">Scope</th>
                <th scope="col">State</th>
                <th scope="col">최근 활동</th>
                <th scope="col">
                  <span className="ado-visually-hidden">열기</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {componentWork.items.map((cw) => (
                <tr key={cw.componentWorkKey}>
                  <td>{cw.primaryComponent.displayName}</td>
                  <td>
                    <Link href={cw.href}>{cw.title}</Link>
                  </td>
                  <td>{cw.executionScope === "single" ? "단일" : "협업"}</td>
                  <td>
                    <StatusBadge tone={STATE_TONE[cw.state] ?? "queued"} label={STATE_LABEL[cw.state] ?? cw.state} />
                  </td>
                  <td>
                    <time dateTime={cw.lastCommittedEventAt} title={formatAbsoluteTime(cw.lastCommittedEventAt)}>
                      {formatRelativeTime(cw.lastCommittedEventAt)}
                    </time>
                  </td>
                  <td>
                    <Link href={cw.href}>열기</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {componentWork.omittedCount > 0 ? (
        <p className={panelStyles.footerLink}>
          그 외 {componentWork.omittedCount}건 더 있음 (전체 {componentWork.totalOpenCount}건 중)
        </p>
      ) : null}
    </Panel>
  );
}
