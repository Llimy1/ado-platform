import {
  findProjects,
  findProject,
  createProject,
} from "./generated/projects/projects";
import type { ApiFieldError, AdoProjectCreateRequest } from "./generated/aDOPlatformAPI.schemas";
import { AdoApiError } from "./errors";
import type { AdoProject } from "@/lib/contracts/ado-project";

// Every apps/api response (success or failure) is the same ApiResponse<T>
// envelope, regardless of HTTP status — orval's generated functions just
// return { data: <envelope>, status }. This is the one place that inspects
// `success` and either unwraps `data` or throws.
function unwrapEnvelope<T>(envelope: {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
  errors?: ApiFieldError[];
}): T {
  if (envelope.success && envelope.data !== undefined) {
    return envelope.data;
  }
  throw new AdoApiError(
    envelope.code ?? "UNKNOWN",
    envelope.message ?? "요청을 처리하지 못했습니다.",
    (envelope.errors ?? []).map((e) => ({ field: e.field ?? "", message: e.message ?? "" })),
  );
}

export const projectClient = {
  async listProjects(): Promise<AdoProject[]> {
    const res = await findProjects();
    return unwrapEnvelope(res.data) as AdoProject[];
  },

  async getProject(id: number): Promise<AdoProject> {
    const res = await findProject(id);
    return unwrapEnvelope(res.data) as AdoProject;
  },

  async createProject(input: AdoProjectCreateRequest): Promise<AdoProject> {
    const res = await createProject(input);
    return unwrapEnvelope(res.data) as AdoProject;
  },
};
