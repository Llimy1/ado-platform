/**
 * Data source seam for the real ADO Project API (GET/POST /v1/projects),
 * mirroring the pattern in ./index.ts: pages and features import through
 * here, never through @/lib/api directly.
 */
export { projectClient } from "@/lib/api/projectClient";
