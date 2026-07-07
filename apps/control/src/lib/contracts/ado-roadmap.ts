/**
 * Domain types for the current backend Roadmap API. These are intentionally
 * separate from ./roadmaps.ts, which models the richer Control Room prototype
 * read model keyed by projectKey/roadmapKey.
 */
import type {
  AdoRoadmapCreateRequest,
  AdoRoadmapResponse,
  AdoRoadmapUpdateRequest,
} from "@/generated/api/aDOPlatformAPI.schemas";

export type AdoRoadmap = Required<AdoRoadmapResponse>;
export type AdoRoadmapCreateInput = AdoRoadmapCreateRequest;
export type AdoRoadmapUpdateInput = AdoRoadmapUpdateRequest;
