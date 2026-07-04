import Link from "next/link";
import panelStyles from "./component-work-matrix.module.css";
import { Panel } from "@/components/Panel";
import { EmptyState } from "@/components/StateViews";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

/**
 * P-04.4: an unaccepted required contract blocks the relevant Work from
 * ready_for_pr and must be displayed with producer, consumer, requirement,
 * state, and proof link.
 */
export function ComponentContractList({ contracts }: { contracts: FeatureUnitDetailResponse["componentContracts"] }) {
  return (
    <Panel title="Component Contracts" headingId="component-contracts-heading">
      {contracts.items.length === 0 ? (
        <EmptyState title="등록된 Component Contract가 없습니다." />
      ) : (
        <div className={panelStyles.wrapper}>
          <table className={panelStyles.table} style={{ minWidth: 620 }}>
            <caption className={panelStyles.caption}>Component Contract 목록, {contracts.items.length}건 표시 중</caption>
            <thead>
              <tr>
                <th scope="col">계약</th>
                <th scope="col">생산자</th>
                <th scope="col">소비자</th>
                <th scope="col">필수</th>
                <th scope="col">상태</th>
                <th scope="col">증빙</th>
              </tr>
            </thead>
            <tbody>
              {contracts.items.map((c) => (
                <tr key={c.contractKey}>
                  <td>
                    <span className={panelStyles.title}>{c.title}</span>
                    <span className={panelStyles.muted}>{c.type}</span>
                  </td>
                  <td>{c.producerComponent}</td>
                  <td>{c.consumerComponent}</td>
                  <td>{c.required ? "필수" : "선택"}</td>
                  <td>
                    <StatusBadge tone={LIFECYCLE_STATE_TONE[c.status] ?? "queued"} label={LIFECYCLE_STATE_LABEL[c.status] ?? c.status} />
                  </td>
                  <td>{c.href ? <Link href={c.href}>증빙 보기</Link> : <span className={panelStyles.muted}>없음</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {contracts.omittedCount > 0 ? (
        <p className={panelStyles.muted} style={{ marginTop: "var(--ado-space-3)" }}>
          그 외 {contracts.omittedCount}건 더 있음
        </p>
      ) : null}
    </Panel>
  );
}
