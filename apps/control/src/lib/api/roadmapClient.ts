import {
  archiveRoadmap as requestArchiveRoadmap,
  createRoadmap,
  findRoadmap,
  findRoadmaps,
  updateRoadmap as requestUpdateRoadmap,
} from "./generated/roadmaps/roadmaps";
import type {
  AdoRoadmapCreateInput,
  AdoRoadmapUpdateInput,
  AdoRoadmap,
} from "@/lib/contracts/ado-roadmap";
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

  async updateRoadmap(roadmapId: number, input: AdoRoadmapUpdateInput): Promise<AdoRoadmap> {
    const res = await requestUpdateRoadmap(roadmapId, input);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },

  async archiveRoadmap(roadmapId: number): Promise<AdoRoadmap> {
    const res = await requestArchiveRoadmap(roadmapId);
    return unwrapAdoResponse(res.data) as AdoRoadmap;
  },
};
