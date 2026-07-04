import Link from "next/link";
import styles from "./acceptance-criteria-table.module.css";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE } from "@/lib/format";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

type Criterion = FeatureUnitDetailResponse["acceptanceCriteria"]["items"][number];

const VERIFICATION_MODE_LABEL: Record<Criterion["verificationMode"], string> = {
  command: "명령 실행",
  artifact_review: "산출물 검토",
  human_check: "사람 확인",
  mixed: "혼합",
};

/**
 * P-04.4: no percent-complete bar — command, artifact, and human checks are
 * non-equivalent gates. Factual counts and each criterion's state instead.
 */
export function AcceptanceCriteriaTable({ items, captionText }: { items: Criterion[]; captionText: string }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>{captionText}</caption>
        <thead>
          <tr>
            <th scope="col">요구사항</th>
            <th scope="col">필수</th>
            <th scope="col">검증 방식</th>
            <th scope="col">근거 상태</th>
            <th scope="col">근거</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.criterionKey}>
              <td>{c.description}</td>
              <td>{c.required ? "필수" : "선택"}</td>
              <td>{VERIFICATION_MODE_LABEL[c.verificationMode]}</td>
              <td>
                <StatusBadge tone={LIFECYCLE_STATE_TONE[c.status] ?? "queued"} label={LIFECYCLE_STATE_LABEL[c.status] ?? c.status} />
              </td>
              <td>{c.evidenceHref ? <Link href={c.evidenceHref}>근거 보기</Link> : <span className={styles.muted}>근거 없음</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
