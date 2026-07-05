import {
  createRoadmap,
  findRoadmap,
  findRoadmaps,
} from "./generated/roadmaps/roadmaps";
import type { AdoRoadmapCreateInput, AdoRoadmap } from "@/lib/contracts/ado-roadmap";
import { unwrapAdoResponse } from "./envelope";

export const roadmapClient = {
  async listRoadmaps(projectId: number): Promise<AdoRoadmap[]> {
    const res = await findRoadmaps(projectId);
    return unwrapAdoResponse(res.data) as AdoRoadmap[];
  },

  async getRoadmap(roadmapId: number): Promise<AdoRoadmap> {
    const res = await findRoadmap(roadmapId);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },

  async createRoadmap(projectId: number, input: AdoRoadmapCreateInput): Promise<AdoRoadmap> {
    const res = await createRoadmap(projectId, input);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },
};
