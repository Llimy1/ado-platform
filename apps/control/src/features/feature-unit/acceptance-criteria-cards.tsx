import Link from "next/link";
import styles from "./acceptance-criteria-cards.module.css";
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

export function AcceptanceCriteriaCards({ items }: { items: Criterion[] }) {
  return (
    <ul className={styles.list}>
      {items.map((c) => (
        <li key={c.criterionKey} className={styles.card}>
          <span className={styles.description}>{c.description}</span>
          <div className={styles.metaRow}>
            <span>{c.required ? "필수" : "선택"}</span>
            <span>{VERIFICATION_MODE_LABEL[c.verificationMode]}</span>
            <StatusBadge tone={LIFECYCLE_STATE_TONE[c.status] ?? "queued"} label={LIFECYCLE_STATE_LABEL[c.status] ?? c.status} />
          </div>
          {c.evidenceHref ? <Link href={c.evidenceHref}>근거 보기</Link> : <span>근거 없음</span>}
        </li>
      ))}
    </ul>
  );
}
