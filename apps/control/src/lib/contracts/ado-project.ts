/**
 * Domain types for GET/POST /v1/projects, sourced from the orval-generated
 * OpenAPI schema (src/generated/api/aDOPlatformAPI.schemas.ts) instead of
 * hand-duplicated. Distinct from ./projects.ts, which is the unrelated
 * Control Room dashboard mock contract.
 */
import type { AdoProjectResponse, AdoProjectCreateRequest } from "@/generated/api/aDOPlatformAPI.schemas";

export type AdoProject = Required<AdoProjectResponse>;
export type AdoProjectCreateInput = AdoProjectCreateRequest;
export type { AdoApiFieldError } from "@/lib/api/errors";
