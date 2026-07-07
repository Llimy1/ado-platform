/**
 * Data source layer — the single seam between UI code (pages, route
 * handlers) and where response data actually comes from.
 *
 * Every function here is currently a thin re-export of an in-memory mock
 * store under `@/lib/mock/*`. Nothing in this app reaches into
 * `@/lib/mock/*` directly except these wrapper files — that is intentional:
 * when the real ADO API is ready, each domain file in this directory
 * should be rewritten to call the generated OpenAPI client instead
 * (e.g. `packages/contracts`'s generated SDK) while keeping the same
 * exported function names and return types defined in `@/lib/contracts/*`.
 * No page or feature component should need to change when that swap
 * happens — only the files in this directory.
 *
 * Do not add request/response shaping, redaction, or business logic here;
 * that belongs in the real API. This layer only selects *where* a read
 * comes from.
 */
export * from "./projects";
export * from "./roadmaps";
export * from "./feature-units";
export * from "./component-work";
export * from "./job-attempts";
export * from "./verification-runs";
export * from "./reviews";
export * from "./pull-requests";
export * from "./human-verification";
export * from "./decisions";
export * from "./incidents";
export * from "./artifacts";
export * from "./system-health";
export * from "./settings";
export * from "./ado-projects";
export * from "./ado-roadmaps";
export * from "./ado-job-attempts";
export * from "./ado-artifacts";
