# ADO Platform NestJS + TypeORM Rules

## 1. Purpose

This document defines the repository-local rules for rebuilding `ado-platform`
as a learning-first NestJS + TypeORM + Next.js platform.

The current `ado-spec.lock.json` pins `NESTJS_MONOREPO_ARCHITECTURE.md`.
That pinned document supports this implementation direction. A later Spec
Library branch may disagree with the NestJS path, so final release alignment
requires a separate Spec Library decision through the controlled change flow.

Until that Spec Library decision is complete, this repository treats the NestJS
direction as the Human Owner's chosen implementation path and marks the broader
Spec alignment as confirmation required.

Minimum Spec preflight:

```bash
git status --short
python3 -m json.tool ado-spec.lock.json >/dev/null
rg -n "NESTJS_MONOREPO_ARCHITECTURE" ado-spec.lock.json docs README.md
```

Expected result:

- `ado-spec.lock.json` parses successfully;
- `NESTJS_MONOREPO_ARCHITECTURE.md` is listed in `canonicalDocumentHashes`;
- any later Spec Library document that disagrees with the Nest path is treated
  as a required follow-up Spec decision, not silently ignored.

## 2. Non-Negotiable Principles

1. PostgreSQL remains the single source of truth for orchestration state.
2. Markdown documents are working artifacts and never outrank database state.
3. `main` is human-controlled and must not be targeted by ADO work.
4. ADO work targets `integrate` through PRs.
5. Browser code never reads PostgreSQL directly.
6. API controllers never mutate TypeORM entities directly.
7. Worker processes never run migrations automatically.
8. Local LLM output is a ReviewResult claim until validated by evidence gates.
9. Human Owner approval remains required for final merge.
10. The initial setup is learning-led and proceeds in small Learning Units.

## 3. Target Baseline

Target baseline:

- NestJS HTTP API in `apps/api`;
- NestJS standalone Worker in `apps/worker`;
- Next.js App Router Control Room in `apps/control`;
- PostgreSQL with TypeORM entities plus reviewed migrations;
- OpenAPI generated from NestJS and consumed by generated TypeScript client
  code;
- `pnpm` for all TypeScript workspace dependencies and scripts;
- `Makefile` as the stable root command surface.

Do not introduce Prisma or MikroORM in A1. If ORM direction changes later, it
must be an explicit architecture PR because migrations, repositories, and
Worker lease behavior all depend on it.

## 4. TypeORM Position

TypeORM is allowed because it gives a learning-friendly bridge between
TypeScript entities and PostgreSQL behavior.

Required TypeORM boundaries:

- `synchronize: false` in every environment;
- schema changes happen only through reviewed TypeORM migrations;
- entities map persistence shape only;
- entity subscribers/listeners must not perform core state transitions;
- controllers must call application services, not repositories directly;
- state transitions run through a State Machine service;
- Worker lease SQL lives in named repository/service methods;
- PostgreSQL-specific locks, constraints, partial indexes, and queue queries
  are reviewed migration SQL or reviewed QueryBuilder/QueryRunner code;
- raw SQL is allowed only in migrations or named persistence methods with
  tests and comments explaining the database behavior.

## 5. Repository Shape

Repository shape is staged. Do not generate every future module during LU-02.

### 5.1 LU-02 Initial Shape

```text
ado-platform/
  apps/
    api/
      src/
        main.ts
        app.module.ts
        health/
    worker/
      src/
        main.ts
    control/
      src/
  packages/
    contracts/
    config/
  docs/
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
  tsconfig.base.json
  Makefile
  .env.example
```

### 5.2 A1 Complete Shape

```text
ado-platform/
  apps/
    api/
    worker/
    control/
  packages/
    domain/
    application/
    persistence/
    contracts/
    config/
    runtime/
    testkit/
  infra/
    docker/
  docs/
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
  turbo.json
  tsconfig.base.json
  Makefile
  .env.example
```

Turborepo may be used for deterministic lint/typecheck/test/build orchestration
after the root commands are understood. It must not hide learning steps during
the first setup.

## 6. Root Command Contract

Humans and agents use root commands. Root commands may delegate to `pnpm`,
Nest CLI scripts, TypeORM migration scripts, frontend scripts, or Turborepo.

Required target commands:

| Command | Required result |
|---|---|
| `make dev-api` | starts the NestJS API with validated local config |
| `make dev-control` | starts the Next.js Control Room against local API |
| `make dev-worker` | starts one NestJS Worker with a unique worker ID |
| `make lint` | runs workspace lint checks |
| `make typecheck` | runs TypeScript typecheck |
| `make test` | runs deterministic tests |
| `make test-integration` | runs PostgreSQL-backed integration tests in an isolated database |
| `make build-api` | builds the API app |
| `make build-worker` | builds the Worker app |
| `make build-control` | builds the Control app |
| `make db-migrate` | applies reviewed TypeORM migrations to a non-production database |
| `make db-plan` | reports pending migrations without mutating production |
| `make spec-check` | verifies the pinned Spec Library lock and authority documents |
| `make openapi` | generates and checks the OpenAPI artifact |
| `make generate-client` | regenerates the TypeScript API client from OpenAPI |

All commands are run from the repository root unless explicitly marked
otherwise.

## 7. API Rules

1. API routes live under `/v1`.
2. NestJS controllers own transport validation and response shaping.
3. Controllers call application services and do not mutate TypeORM entities.
4. Reads and commands are separate operations.
5. State-changing commands require idempotency keys where replay is possible.
6. Error responses use stable machine codes and avoid sensitive detail.
7. OpenAPI is generated in CI and checked for drift.
8. Breaking transport changes require `/v2` or a human-approved compatibility
   plan.

Initial OpenAPI standard:

- NestJS Swagger generates `apps/api/openapi.json`;
- `openapi-typescript` generates types under `packages/contracts/src/generated/`;
- a checked client wrapper lives under `packages/contracts/src/`;
- `make openapi` fails when generated OpenAPI differs from the committed
  artifact;
- `make generate-client` fails when generated TypeScript output differs from
  committed output.

OpenAPI is the Nest-to-Next contract. It is not an LLM prompt format.

## 8. Worker Rules

A1 Worker scope is a process shell only: config validation, database preflight,
`--worker-id`, `--once`, and graceful shutdown.

Stateful job leasing, artifacts, audit evidence, stale recovery, retry
behavior, and local LLM review loops require later State/Evidence/Job
contracts.

Worker rules:

1. one Worker process handles one Job concurrently by default;
2. the Worker leases Jobs from PostgreSQL, not Redis, BullMQ, Kafka, or a cloud
   queue in v1-alpha;
3. external tools, model calls, Git, and GitHub commands run outside database
   transactions;
4. local LLM output is stored as a structured ReviewResult claim;
5. every terminal attempt records facts, artifacts, and audit evidence;
6. SIGTERM/SIGINT triggers bounded drain and owned-child cleanup;
7. stale lease recovery is explicit and audited.

## 9. Next.js Control Room Rules

1. Next.js remains the primary Control Room UI.
2. The Control Room uses generated API clients or checked transport types.
3. The browser never receives database credentials, Worker secrets, raw provider
   payloads, or unredacted logs.
4. SSE is a freshness signal only. REST snapshots remain authoritative.
5. Command controls render from API-provided allowed actions, not local enum
   guesses.

## 10. Local Reviewer And Feedback Rules

Ollama or other local LLM calls are only the adapter boundary. ADO review
quality improves through stored feedback:

- each model review creates a `ReviewResult` claim;
- each finding receives a Human/Codex decision;
- accepted findings can become rule or evidence-gate improvement candidates;
- rejected findings can become false-positive memory;
- prompt/profile changes are versioned artifacts;
- model agreement alone is not completion evidence.

Do not fine-tune a model as part of A1. Fine-tuning requires a later dataset,
evaluation, model-versioning, and rollback policy.

## 11. Branch And PR Rules

1. Branch from `integrate`.
2. Use focused branches with the `ado/` prefix.
3. Target PRs to `integrate`.
4. Do not merge to `main`.
5. Do not combine unrelated Learning Units in one PR.
6. Every PR includes verification output or explains why a command is not
   applicable.

Required branch workflow:

```bash
git status --short
git fetch origin
git switch integrate
git merge --ff-only origin/integrate
git switch -c ado/lu-XX-short-title
```

`integrate` and `main` branch protection status is confirmation required until
verified in GitHub. Do not claim branch protection is active from documentation
alone.

## 12. Completion Criteria For A1

A1 is complete only when:

1. `pnpm install`, `make lint`, `make typecheck`, `make test`,
   `make test-integration`, `make build-api`, `make build-worker`,
   `make build-control`, `make openapi`, and `make generate-client` exist and
   pass in a clean checkout;
2. TypeORM migrations initialize the ADO database;
3. the NestJS API reports health/readiness and generates OpenAPI;
4. the NestJS Worker starts, preflights PostgreSQL, and exits gracefully;
5. the Next.js Control app reads API health through the generated contract;
6. CI verifies backend, frontend, OpenAPI, migration, and integration gates;
7. README and A1 documentation describe NestJS + TypeORM as current.
