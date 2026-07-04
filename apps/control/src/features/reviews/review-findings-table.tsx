import Link from "next/link";
import styles from "./review-findings-table.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/StateViews";
import type { FindingResolution, FindingSeverity, ReviewGroupDetailResponse } from "@/lib/contracts/review-group";

type Finding = ReviewGroupDetailResponse["findings"][number];

const SEVERITY_TONE: Record<FindingSeverity, "failure" | "warning" | "info" | "queued"> = {
  P0: "failure",
  P1: "failure",
  P2: "warning",
  P3: "info",
  info: "queued",
};

const RESOLUTION_LABEL: Record<FindingResolution, string> = {
  accepted: "승인됨",
  rejected: "반려됨",
  human_required: "사람 확인 필요",
  informational: "참고용",
};

/** Server-owned sort/dedup order: accepted P0/P1, accepted P2, human-required, then informational. */
function sortPriority(f: Finding): number {
  if (f.resolution === "accepted" && (f.severity === "P0" || f.severity === "P1")) return 0;
  if (f.resolution === "accepted" && f.severity === "P2") return 1;
  if (f.resolution === "human_required") return 2;
  return 3;
}

/**
 * P-07.3: severity, category, title, authorized file/line, source reviewer
 * count, resolution, evidence, RevisionTask. The API groups findings by
 * deduplication_hash — the browser never decides duplicates, and there is
 * no "ignore finding" action here.
 */
export function ReviewFindingsTable({ findings }: { findings: Finding[] }) {
  const sorted = [...findings].sort((a, b) => sortPriority(a) - sortPriority(b));

  return (
    <Panel title="리뷰 지적사항" headingId="review-findings-heading">
      {sorted.length === 0 ? (
        <EmptyState title="지적사항이 없습니다." />
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>리뷰 지적사항, {sorted.length}건 표시 중</caption>
            <thead>
              <tr>
                <th scope="col">심각도</th>
                <th scope="col">분류</th>
                <th scope="col">제목</th>
                <th scope="col">출처 리뷰어</th>
                <th scope="col">해결 상태</th>
                <th scope="col">근거 / RevisionTask</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((f) => (
                <tr key={f.findingKey}>
                  <td>
                    <StatusBadge tone={SEVERITY_TONE[f.severity]} label={f.severity} />
                  </td>
                  <td>{f.category}</td>
                  <td>
                    {f.fileHref ? <Link href={f.fileHref}>{f.title}</Link> : f.title}
                  </td>
                  <td>{f.sourceReviewerCount}명</td>
                  <td>{RESOLUTION_LABEL[f.resolution]}</td>
                  <td>
                    {f.evidenceHref ? <Link href={f.evidenceHref}>근거</Link> : <span className={styles.muted}>없음</span>}
                    {f.revisionTaskHref ? (
                      <>
                        {" · "}
                        <Link href={f.revisionTaskHref}>RevisionTask</Link>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
