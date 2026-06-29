# A1 Foundation

## Current Status

A1 is intentionally not implemented yet.

The Human Owner has chosen to rebuild ADO Platform with NestJS, TypeORM,
PostgreSQL, local LLM review adapters, and Next.js while learning each setup
step.

New A1 work must follow:

- `docs/PLATFORM_NESTJS_TYPEORM_RULES.md`
- `docs/LEARNING_FIRST_SETUP_PROTOCOL.md`
- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/NESTJS_PROJECT_STRUCTURE.md`
- `docs/CONFIGURATION_POLICY.md`
- `docs/LEARNING_PR_POLICY.md`

## Learning-First Scope

A1 will be rebuilt through Learning Units instead of a generated skeleton:

1. LU-01 Node.js and `pnpm` baseline
2. LU-02 NestJS workspace and app shells
3. LU-03 settings and environment
4. LU-04 Nest health API and OpenAPI
5. LU-05 PostgreSQL and TypeORM migrations
6. LU-06 Nest Worker process shell
7. LU-07 Next Control health screen
8. LU-08 root command surface

Each Learning Unit must explain the concept, list touched files, run a small
verification command, and leave a checkpoint summary before moving on.

## Target A1 Outcome

A1 is complete only when the repository contains a runnable NestJS + TypeORM +
Next.js foundation:

- Node.js `pnpm` workspace and lockfile
- NestJS API with `GET /v1/health`
- Next.js Control app with an API health panel
- NestJS Worker process shell with database preflight, `--worker-id`, `--once`,
  and graceful shutdown
- PostgreSQL local development profile
- TypeORM migration path with `synchronize: false`
- OpenAPI JSON generation at `apps/api/openapi.json`
- generated TypeScript contract/client under `packages/contracts`
- root commands for lint, typecheck, test, integration, builds, migrations,
  Spec Library preflight, OpenAPI, and generated client checks
- CI baseline for the same gates

A1 does not complete the stateful Worker lease loop. Job leasing, artifacts,
audit evidence, stale recovery, retry behavior, local LLM review feedback
loops, and state transitions require later State/Evidence/Job contracts.
