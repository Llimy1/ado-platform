import Link from "next/link";
import styles from "./feature-unit-decomposition-table.module.css";
import { MachineValue } from "@/components/MachineValue";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFECYCLE_STATE_LABEL, LIFECYCLE_STATE_TONE, RISK_LEVEL_LABEL } from "@/lib/format";
import type { RoadmapDetailResponse } from "@/lib/contracts/roadmaps";

type Item = RoadmapDetailResponse["featureUnits"]["items"][number];

/**
 * P-03.5: read-only, sequence-fixed table. No ARIA grid, no drag-and-drop,
 * no in-cell editing — state transitions only happen through named commands
 * on the Feature Unit detail route.
 */
export function FeatureUnitDecompositionTable({ items, captionText }: { items: Item[]; captionText: string }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>{captionText}</caption>
        <thead>
          <tr>
            <th scope="col">순서</th>
            <th scope="col">Feature Unit</th>
            <th scope="col">상태</th>
            <th scope="col">위험도</th>
            <th scope="col">의존성</th>
            <th scope="col">Component Work</th>
            <th scope="col">사람 승인</th>
            <th scope="col">
              <span className="ado-visually-hidden">열기</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.featureUnitKey}>
              <td>{item.sequenceNumber}</td>
              <td>
                <Link href={item.href} className={styles.title}>
                  {item.title}
                </Link>
                <MachineValue value={item.featureUnitKey} label="featureUnitKey" />
              </td>
              <td>
                <StatusBadge
                  tone={LIFECYCLE_STATE_TONE[item.state] ?? "queued"}
                  label={LIFECYCLE_STATE_LABEL[item.state] ?? item.state}
                />
              </td>
              <td>{RISK_LEVEL_LABEL[item.riskLevel as keyof typeof RISK_LEVEL_LABEL] ?? item.riskLevel}</td>
              <td>
                {item.dependency.requiredPrerequisiteCount === 0 ? (
                  <span className={styles.muted}>없음</span>
                ) : (
                  <span>
                    {item.dependency.requiredPrerequisiteCount - item.dependency.unsatisfiedPrerequisiteCount}/
                    {item.dependency.requiredPrerequisiteCount} 충족
                  </span>
                )}
              </td>
              <td>
                필수 {item.componentWork.requiredCount} · 열림 {item.componentWork.openCount} · 차단{" "}
                {item.componentWork.blockedCount} · PR {item.componentWork.prCreatedCount}
              </td>
              <td>
                {item.pendingHumanDecisionCount > 0 ? (
                  <StatusBadge tone="warning" label={`대기 ${item.pendingHumanDecisionCount}건`} />
                ) : (
                  <span className={styles.muted}>없음</span>
                )}
              </td>
              <td>
                <Link href={item.href}>열기</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
