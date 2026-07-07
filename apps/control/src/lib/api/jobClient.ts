import { findJobAttempt, findJobAttemptLogs, findArtifact } from "@/generated/api/jobs/jobs";
import type { FindJobAttemptLogsParams } from "@/generated/api/aDOPlatformAPI.schemas";
import type { AdoJobAttemptDetail, AdoJobLogPage, AdoArtifact } from "@/lib/contracts/ado-job";
import { unwrapAdoResponse } from "./envelope";

export const jobAttemptClient = {
  async getJobAttempt(jobAttemptId: string): Promise<AdoJobAttemptDetail> {
    const res = await findJobAttempt(jobAttemptId);
    return unwrapAdoResponse(res.data) as AdoJobAttemptDetail;
  },

  async getJobAttemptLogs(jobAttemptId: string, params?: FindJobAttemptLogsParams): Promise<AdoJobLogPage> {
    const res = await findJobAttemptLogs(jobAttemptId, params);
    return unwrapAdoResponse(res.data) as AdoJobLogPage;
  },
};

export const artifactClient = {
  async getArtifact(projectKey: string, artifactKey: string): Promise<AdoArtifact> {
    const res = await findArtifact(projectKey, artifactKey);
    return unwrapAdoResponse(res.data) as AdoArtifact;
  },
};
