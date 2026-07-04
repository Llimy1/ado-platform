import type { DependencyGraphEdge, DependencyGraphNode } from "@/lib/contracts/dependency-graph";

export interface LayoutNode {
  node: DependencyGraphNode;
  layer: number;
  indexInLayer: number;
}

/**
 * Bounded, deterministic layered layout shared by P-02 and P-03 dependency
 * figures: layer = 1 + max layer of prerequisites, stable-sorted within a
 * layer by featureUnitKey (no sequence_number is exposed on these trimmed
 * projections).
 */
export function computeDependencyLayers(
  nodes: DependencyGraphNode[],
  edges: DependencyGraphEdge[],
): LayoutNode[] {
  const incoming = new Map<string, string[]>();
  for (const n of nodes) incoming.set(n.featureUnitKey, []);
  for (const e of edges) {
    if (!incoming.has(e.toFeatureUnitKey)) incoming.set(e.toFeatureUnitKey, []);
    incoming.get(e.toFeatureUnitKey)!.push(e.fromFeatureUnitKey);
  }

  const layerByKey = new Map<string, number>();
  const visiting = new Set<string>();

  function layerOf(key: string): number {
    if (layerByKey.has(key)) return layerByKey.get(key)!;
    if (visiting.has(key)) return 0; // defensive cycle guard; approved graphs have none
    visiting.add(key);
    const prereqs = incoming.get(key) ?? [];
    const layer = prereqs.length === 0 ? 0 : 1 + Math.max(...prereqs.map(layerOf));
    visiting.delete(key);
    layerByKey.set(key, layer);
    return layer;
  }

  for (const n of nodes) layerOf(n.featureUnitKey);

  const sorted = [...nodes].sort((a, b) => {
    const layerDiff = layerOf(a.featureUnitKey) - layerOf(b.featureUnitKey);
    if (layerDiff !== 0) return layerDiff;
    return a.featureUnitKey.localeCompare(b.featureUnitKey);
  });

  const countPerLayer = new Map<number, number>();
  return sorted.map((node) => {
    const layer = layerOf(node.featureUnitKey);
    const indexInLayer = countPerLayer.get(layer) ?? 0;
    countPerLayer.set(layer, indexInLayer + 1);
    return { node, layer, indexInLayer };
  });
}
