/**
 * Data source layer for Project list/overview reads.
 *
 * This is the seam pages and route handlers must import through instead of
 * reaching into `@/lib/mock/*` directly. It currently re-exports the
 * in-memory mock store; when the real ADO API is ready, replace these
 * implementations with calls into the generated OpenAPI client. Call sites
 * should not need to change when that swap happens.
 */
export {
  queryProjects,
  validateProjectListQuery,
  getProjectOverview,
  listAllProjectKeys,
} from "@/lib/mock/project-store";
