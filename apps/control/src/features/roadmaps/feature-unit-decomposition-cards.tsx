import Link from "next/link";
import styles from "./feature-unit-decomposition-cards.module.css";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, RISK_LEVEL_LABEL } from "@/lib/format";
import type { RoadmapDetailResponse } from "@/lib/contracts/roadmaps";

type Item = RoadmapDetailResponse["featureUnits"]["items"][number];

/** P-03.5 mobile/tablet representation: sequence/state/risk, title, then facts. */
export function FeatureUnitDecompositionCards({ items }: { items: Item[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.featureUnitKey} className={styles.card}>
          <div className={styles.topRow}>
            <span>#{item.sequenceNumber}</span>
            <StatusBadge
              tone={LIFECYCLE_STATE_TONE[item.state] ?? "queued"}
              label={LIFECYCLE_STATE_LABEL[item.state] ?? item.state}
            />
            <span>위험도 {RISK_LEVEL_LABEL[item.riskLevel as keyof typeof RISK_LEVEL_LABEL] ?? item.riskLevel}</span>
          </div>
          <Link href={item.href} className={styles.title}>
            {item.title}
          </Link>
          <div className={styles.metaRow}>
            <div>
              <span className={styles.metaLabel}>의존성</span>
              {item.dependency.requiredPrerequisiteCount === 0
                ? "없음"
                : `${item.dependency.requiredPrerequisiteCount - item.dependency.unsatisfiedPrerequisiteCount}/${item.dependency.requiredPrerequisiteCount} 충족`}
            </div>
            <div>
              <span className={styles.metaLabel}>사람 승인</span>
              {item.pendingHumanDecisionCount > 0 ? `대기 ${item.pendingHumanDecisionCount}건` : "없음"}
            </div>
            <div>
              <span className={styles.metaLabel}>Component Work</span>
              필수 {item.componentWork.requiredCount} · 열림 {item.componentWork.openCount}
            </div>
            <div>
              <span className={styles.metaLabel}>PR</span>
              {item.componentWork.prCreatedCount}건
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
