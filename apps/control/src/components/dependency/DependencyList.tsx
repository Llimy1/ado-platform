import styles from "./DependencyList.module.css";
import type { DependencyMap } from "@/lib/contracts/dependency-graph";

interface DependencyListProps {
  dependencyMap: DependencyMap;
  anchorId?: string;
}

/**
 * Accessible relationship table built from `accessibleRows`: the only
 * dependency representation below 768px, and always available to assistive
 * technology regardless of the disclosure's open/closed visual state.
 * Shared by P-02 and P-03.
 */
export function DependencyList({ dependencyMap, anchorId = "dependency-list" }: DependencyListProps) {
  if (dependencyMap.accessibleRows.length === 0) return null;
  const titleByKey = new Map(dependencyMap.nodes.map((n) => [n.featureUnitKey, n.title]));

  return (
    <details id={anchorId} open>
      <summary className={styles.summary}>의존성 목록 보기</summary>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="ado-visually-hidden">Feature Unit 의존성 관계 목록</caption>
          <thead>
            <tr>
              <th scope="col">Feature Unit</th>
              <th scope="col">선행 조건</th>
              <th scope="col">차단 대상</th>
            </tr>
          </thead>
          <tbody>
            {dependencyMap.accessibleRows.map((row) => (
              <tr key={row.featureUnitKey}>
                <td>{titleByKey.get(row.featureUnitKey) ?? row.featureUnitKey}</td>
                <td>
                  {row.dependsOn.length === 0
                    ? "없음"
                    : row.dependsOn.map((k) => titleByKey.get(k) ?? k).join(", ")}
                </td>
                <td>
                  {row.blocks.length === 0
                    ? "없음"
                    : row.blocks.map((k) => titleByKey.get(k) ?? k).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
