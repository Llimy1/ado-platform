import type { AttentionSeverity } from "./projects";

/**
 * Shared `depends_on` graph shape used by P-02 (Project Overview) and P-03
 * (Roadmap detail). `attentionSeverity` is optional because the Roadmap
 * projection (P-03.2) does not expose it on graph nodes, only the Project
 * Overview projection (P-02.2) does.
 */
export interface DependencyGraphNode {
  featureUnitKey: string;
  title: string;
  state: string;
  attentionSeverity?: AttentionSeverity;
  href: string;
}

export interface DependencyGraphEdge {
  fromFeatureUnitKey: string;
  toFeatureUnitKey: string;
  relation: "depends_on";
}

export interface DependencyAccessibleRow {
  featureUnitKey: string;
  dependsOn: string[];
  blocks: string[];
}

export interface DependencyMap {
  isTruncated: boolean;
  omittedNodeCount: number;
  nodes: DependencyGraphNode[];
  edges: DependencyGraphEdge[];
  accessibleRows: DependencyAccessibleRow[];
}
