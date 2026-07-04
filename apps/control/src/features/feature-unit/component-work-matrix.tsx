import Link from "next/link";
import styles from "./component-work-matrix.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

/**
 * P-04.4 Component Work matrix. Rows never contain pause/retry/cancel —
 * those commands require Component Work detail context, not this summary.
 */
export function ComponentWorkMatrix({ componentWork }: { componentWork: FeatureUnitDetailResponse["componentWork"] }) {
  return (
    <Panel title="Component Work" headingId="component-work-matrix-heading">
      {componentWork.items.length === 0 ? (
        <EmptyState title="등록된 Component Work가 없습니다." />
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>Component Work 매트릭스, {componentWork.items.length}건 표시 중</caption>
            <thead>
              <tr>
                <th scope="col">Component / Work</th>
                <th scope="col">Scope</th>
                <th scope="col">필수</th>
                <th scope="col">State</th>
                <th scope="col">검증</th>
                <th scope="col">리뷰</th>
                <th scope="col">PR</th>
                <th scope="col">
                  <span className="ado-visually-hidden">열기</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {componentWork.items.map((cw) => (
                <tr key={cw.componentWorkKey}>
                  <td>
                    <span className={styles.title}>{cw.primaryComponent.displayName}</span>
                    <Link href={cw.href}>{cw.title}</Link>
                  </td>
                  <td>
                    {cw.executionScope === "single"
                      ? "단일"
                      : `협업 (${cw.scopeComponents.map((c) => c.displayName).join(", ")})`}
                  </td>
                  <td>{cw.required ? "필수" : "선택"}</td>
                  <td>
                    <StatusBadge tone={LIFECYCLE_STATE_TONE[cw.state] ?? "queued"} label={LIFECYCLE_STATE_LABEL[cw.state] ?? cw.state} />
                  </td>
                  <td>{LIFECYCLE_STATE_LABEL[cw.verification] ?? cw.verification}</td>
                  <td>{LIFECYCLE_STATE_LABEL[cw.review] ?? cw.review}</td>
                  <td>
                    {cw.pullRequest ? (
                      <Link href={cw.pullRequest.href}>{cw.pullRequest.pullRequestId}</Link>
                    ) : (
                      <span className={styles.muted}>없음</span>
                    )}
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
        <p className={styles.muted} style={{ marginTop: "var(--ado-space-3)" }}>
          그 외 {componentWork.omittedCount}건 더 있음
        </p>
      ) : null}
    </Panel>
  );
}
