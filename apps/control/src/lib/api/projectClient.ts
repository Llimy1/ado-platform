import {
  findProjects,
  findProject,
  createProject,
} from "./generated/projects/projects";
import type { AdoProjectCreateRequest } from "./generated/aDOPlatformAPI.schemas";
import type { AdoProject } from "@/lib/contracts/ado-project";
import { unwrapAdoResponse } from "./envelope";

export const projectClient = {
  async listProjects(): Promise<AdoProject[]> {
    const res = await findProjects();
    return unwrapAdoResponse(res.data) as AdoProject[];
  },

  async getProject(id: number): Promise<AdoProject> {
    const res = await findProject(id);
    return unwrapAdoResponse(res.data) as AdoProject;
  },

  async createProject(input: AdoProjectCreateRequest): Promise<AdoProject> {
    const res = await createProject(input);
    return unwrapAdoResponse(res.data) as AdoProject;
  },
};
