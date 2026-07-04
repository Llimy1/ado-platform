import Link from "next/link";
import styles from "./feature-dependency-lists.module.css";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import type { FeatureUnitDetailResponse } from "@/lib/contracts/feature-unit";

/**
 * P-04.4: two native lists, 선행 조건 and 이 작업을 기다리는 단위. These are
 * primary and the only dependency representation below 768px (no SVG
 * diagram in this prototype — P-04 spec marks the diagram optional).
 */
export function FeatureDependencyLists({ dependencies }: { dependencies: FeatureUnitDetailResponse["dependencies"] }) {
  return (
    <Panel title="의존성 조건" headingId="feature-dependency-lists-heading">
      <div className={styles.columns}>
        <div>
          <h3 className={styles.muted}>선행 조건</h3>
          {dependencies.prerequisites.length === 0 ? (
            <p className={styles.muted}>없음</p>
          ) : (
            <ul className={styles.list}>
              {dependencies.prerequisites.map((p) => (
                <li key={p.featureUnitKey} className={styles.row}>
                  <Link href={p.href}>{p.title}</Link>
                  {p.waivedByDecisionHref ? (
                    <Link href={p.waivedByDecisionHref}>
                      <StatusBadge tone="info" label="면제됨" />
                    </Link>
                  ) : p.satisfied ? (
                    <StatusBadge tone="success" label="충족" />
                  ) : (
                    <StatusBadge tone="warning" label="미충족" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className={styles.muted}>이 작업을 기다리는 단위</h3>
          {dependencies.dependents.length === 0 ? (
            <p className={styles.muted}>없음</p>
          ) : (
            <ul className={styles.list}>
              {dependencies.dependents.map((d) => (
                <li key={d.featureUnitKey} className={styles.row}>
                  <Link href={d.href}>{d.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Panel>
  );
}
