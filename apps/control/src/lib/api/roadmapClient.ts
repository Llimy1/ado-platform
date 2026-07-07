import {
  archiveRoadmap as requestArchiveRoadmap,
  createRoadmap,
  findRoadmap,
  findRoadmaps,
  updateRoadmap as requestUpdateRoadmap,
} from "@/generated/api/roadmaps/roadmaps";
import type {
  AdoRoadmapCreateInput,
  AdoRoadmapUpdateInput,
  AdoRoadmap,
} from "@/lib/contracts/ado-roadmap";
import { unwrapAdoResponse } from "./envelope";

export const roadmapClient = {
  async listRoadmaps(projectKey: string): Promise<AdoRoadmap[]> {
    const res = await findRoadmaps(projectKey);
    return unwrapAdoResponse(res.data) as AdoRoadmap[];
  },

  async getRoadmap(projectKey: string, roadmapKey: string): Promise<AdoRoadmap> {
    const res = await findRoadmap(projectKey, roadmapKey);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },

  async createRoadmap(projectKey: string, input: AdoRoadmapCreateInput): Promise<AdoRoadmap> {
    const res = await createRoadmap(projectKey, input);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },

  async updateRoadmap(projectKey: string, roadmapKey: string, input: AdoRoadmapUpdateInput): Promise<AdoRoadmap> {
    const res = await requestUpdateRoadmap(projectKey, roadmapKey, input);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },

  async archiveRoadmap(projectKey: string, roadmapKey: string): Promise<AdoRoadmap> {
    const res = await requestArchiveRoadmap(projectKey, roadmapKey);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },
};
