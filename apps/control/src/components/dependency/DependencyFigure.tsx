import Link from "next/link";
import styles from "./DependencyFigure.module.css";
import { EmptyState } from "@/components/StateViews";
import { computeDependencyLayers } from "@/lib/dependency-layout";
import type { DependencyMap } from "@/lib/contracts/dependency-graph";

const NODE_W = 148;
const NODE_H = 44;
const GAP_X = 64;
const GAP_Y = 20;
const PAD = 16;

const SEVERITY_STROKE: Record<string, string> = {
  none: "var(--ado-color-border-strong)",
  warning: "var(--ado-color-state-warning)",
  critical: "var(--ado-color-state-failure)",
};

interface DependencyFigureProps {
  dependencyMap: DependencyMap;
  /** Anchor id the truncation note links to; must match the adjacent DependencyList's id. */
  listAnchorId?: string;
}

/**
 * Noninteractive SVG behind an equivalent accessible list (rendered
 * separately by DependencyList). Hidden below 768px via CSS; the accessible
 * list is the sole representation there. Shared by P-02 and P-03 per the
 * SVG-plus-text contract in ADO/CONTROL_ROOM_PAGE_SPECS.md P-02.5 / P-03.6.
 */
export function DependencyFigure({ dependencyMap, listAnchorId = "dependency-list" }: DependencyFigureProps) {
  if (dependencyMap.nodes.length === 0) {
    return <EmptyState title="표시할 의존성이 없습니다." />;
  }

  const layout = computeDependencyLayers(dependencyMap.nodes, dependencyMap.edges);
  const positionByKey = new Map(layout.map((l) => [l.node.featureUnitKey, l]));
  const maxLayer = Math.max(...layout.map((l) => l.layer));
  const maxIndexInLayer = Math.max(...layout.map((l) => l.indexInLayer));
  const width = PAD * 2 + (maxLayer + 1) * NODE_W + maxLayer * GAP_X;
  const height = PAD * 2 + (maxIndexInLayer + 1) * NODE_H + maxIndexInLayer * GAP_Y;

  function centerOf(key: string) {
    const pos = positionByKey.get(key);
    if (!pos) return { x: 0, y: 0 };
    const x = PAD + pos.layer * (NODE_W + GAP_X);
    const y = PAD + pos.indexInLayer * (NODE_H + GAP_Y);
    return { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 };
  }

  return (
    <div className={styles.figureWrap}>
      <figure aria-hidden="true">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
          <g>
            {dependencyMap.edges.map((edge, i) => {
              const from = centerOf(edge.fromFeatureUnitKey);
              const to = centerOf(edge.toFeatureUnitKey);
              const x1 = from.x + NODE_W;
              const x2 = to.x;
              return (
                <path
                  key={i}
                  d={`M ${x1} ${from.cy} C ${x1 + GAP_X / 2} ${from.cy}, ${x2 - GAP_X / 2} ${to.cy}, ${x2} ${to.cy}`}
                  fill="none"
                  stroke="var(--ado-color-border-strong)"
                  strokeWidth="1.5"
                  markerEnd="url(#ado-dep-arrow)"
                />
              );
            })}
          </g>
          <defs>
            <marker id="ado-dep-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--ado-color-text-tertiary)" />
            </marker>
          </defs>
          {layout.map(({ node }) => {
            const pos = centerOf(node.featureUnitKey);
            return (
              <g key={node.featureUnitKey}>
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={4}
                  fill="var(--ado-color-surface)"
                  stroke={SEVERITY_STROKE[node.attentionSeverity ?? "none"]}
                  strokeWidth="1.5"
                />
                <text x={pos.x + 8} y={pos.y + 18} fontSize="11" fill="var(--ado-color-text-strong)">
                  {node.title.length > 18 ? `${node.title.slice(0, 17)}…` : node.title}
                </text>
                <text x={pos.x + 8} y={pos.y + 34} fontSize="10" fill="var(--ado-color-text-tertiary)">
                  {node.state}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className={styles.caption}>
          Feature Unit 의존성 그래프: {dependencyMap.nodes.length}개 노드, {dependencyMap.edges.length}개 depends_on 관계
        </figcaption>
      </figure>
      {dependencyMap.isTruncated ? (
        <p className={styles.truncatedNote}>
          {dependencyMap.omittedNodeCount}개 노드가 생략되었습니다.{" "}
          <Link href={`#${listAnchorId}`}>의존성 목록에서 전체 보기</Link>
        </p>
      ) : null}
    </div>
  );
}
