# ADO Platform Spring Boot + Spring Batch Rules

## 1. Purpose

This document defines the repository-local rules for rebuilding `ado-platform`
as a learning-first Spring Boot + Spring Batch + PostgreSQL + Next.js platform.

This is the Human Owner's current implementation decision. The pinned Spec
Library still contains `NESTJS_MONOREPO_ARCHITECTURE.md`, so final Spec
alignment is confirmation required until a later Spec Library revision replaces
or supersedes that document.

Minimum Spec preflight:

```bash
git status --short
python3 -m json.tool ado-spec.lock.json >/dev/null
rg -n "NESTJS_MONOREPO_ARCHITECTURE|Spring|Batch" ado-spec.lock.json docs README.md
```

Expected result:

- `ado-spec.lock.json` parses successfully;
- the current Nest architecture pin is visible;
- Spring direction is documented as repository-local until Spec alignment is
  updated.

## 2. Non-Negotiable Principles

1. PostgreSQL remains the single source of truth for orchestration state.
2. Markdown documents are working artifacts and never outrank database state.
3. `main` is human-controlled and must not be targeted by ADO work.
4. ADO work targets `integrate` through PRs.
5. Browser code never reads PostgreSQL directly.
6. API controllers never mutate JPA entities directly.
7. Worker processes never run Flyway migrations automatically.
8. Local LLM output is a ReviewResult claim until validated by evidence gates.
9. Human Owner approval remains required for final merge.
10. The initial setup is learning-led and proceeds in small Learning Units.
11. When the Human Owner implements code manually, Codex owns the final
    verification pass and must rerun the relevant evidence commands before a
    Learning Unit is called complete.

## 3. Target Baseline

Target baseline:

- Java 21 LTS;
- Gradle wrapper with Groovy DSL, created during LU-01 through Spring
  Initializr or a verified local Gradle installation;
- Spring Boot HTTP API in `apps/api`;
- Spring Batch Worker in `apps/worker`;
- Next.js App Router Control Room in `apps/control`;
- PostgreSQL with Flyway migrations;
- JPA for persistence mapping and ordinary repositories;
- Querydsl for dynamic read queries where it clearly helps;
- JdbcTemplate or reviewed native SQL for PostgreSQL locking, leases, and
  database-specific Worker behavior;
- OpenAPI generated from Spring and consumed by a generated TypeScript client;
- OpenAPI client output generated into `apps/control/src/generated/api/` after
  the Control app exists;
- Spring configuration files use `.properties` during A1;
- npm only inside `apps/control`;
- no root pnpm workspace.

Recommended baseline versions as of this policy update:

| Tool | Policy |
|---|---|
| Java | `21.0.11` locally, Java 21 language/toolchain |
| Spring Boot | `3.5.16` |
| Gradle | `8.14.5` wrapper |
| Spring dependency management plugin | `1.1.7` |
| Node.js | only for `apps/control`; exact version decided when Next is created |
| npm | use `package-lock.json` inside `apps/control` |

Version numbers that affect compatibility must be verified by the Learning
Unit that pins them. If an exact version cannot be resolved locally, mark it as
확인 필요 instead of guessing.

## 4. Persistence Position

Flyway owns schema changes. Hibernate must not mutate the schema in local,
test, CI, or future production modes.

Required persistence boundaries:

- Flyway migrations are reviewed source files;
- `spring.jpa.hibernate.ddl-auto` is `validate` or disabled, never `update`;
- JPA entities map persistence shape only;
- entity listeners must not perform core state transitions;
- controllers call application services, not repositories directly;
- state transitions run through a State Machine service;
- Querydsl is for readable dynamic queries, not a blanket replacement for SQL;
- Querydsl setup must document annotation processing, generated Q-class output,
  and the verification command that proves Q-classes are regenerated;
- Worker lease SQL lives in named repository/service methods;
- PostgreSQL-specific locks, constraints, partial indexes, and queue queries
  are reviewed migration SQL or reviewed JdbcTemplate/native SQL;
- raw SQL is allowed only in migrations or named persistence methods with tests
  and comments explaining the database behavior.

PostgreSQL-backed tests use Testcontainers by default unless a Learning Unit
explicitly chooses a different isolated PostgreSQL method and documents why.

## 5. Root Command Contract

Humans and agents use Gradle tasks. During early Learning Units, the owning
project task is the source of truth. LU-09 may add root alias tasks after the
Human Owner understands the delegated commands.

Gradle project paths are fixed by `settings.gradle`:

```groovy
include 'apps:api'
include 'apps:worker'
```

This means the API project path is `:apps:api` and the Worker project path is
`:apps:worker`.
Do not include `apps:worker` before the Worker project exists.

Required A1 target commands:

| Command | Required result |
|---|---|
| `./gradlew :apps:api:bootRun` | starts the Spring Boot API with validated local config |
| `./gradlew :apps:worker:bootRun --args="--worker-id local-dev --once"` | starts one Spring Batch Worker shell |
| `./gradlew test` | runs deterministic JVM tests |
| `./gradlew integrationTest` | runs PostgreSQL-backed integration tests in an isolated database |
| `./gradlew build` | builds JVM modules |
| `./gradlew :apps:api:flywayMigrate` | applies reviewed migrations to a non-production database before root aliases exist |
| `./gradlew :apps:api:flywayInfo` | reports migration state without mutating data before root aliases exist |
| `./gradlew :apps:api:openApiGenerate` | generates or checks the OpenAPI artifact before root aliases exist |
| `./gradlew flywayMigrate` | LU-09 root alias for `:apps:api:flywayMigrate` |
| `./gradlew flywayInfo` | LU-09 root alias for `:apps:api:flywayInfo` |
| `./gradlew openApiGenerate` | LU-09 root alias for `:apps:api:openApiGenerate` |
| `./gradlew generateApiClient` | LU-09 root task that regenerates the TypeScript API client into `apps/control/src/generated/api/` |
| `cd apps/control && npm run dev` | starts the Control Room |
| `cd apps/control && npm run build` | builds the Control Room |

All root automation should prefer Gradle. A `Makefile` may be added later as a
thin convenience wrapper only after the Gradle task names are understood.

## 6. API Rules

1. API routes live under `/v1`.
2. Spring MVC controllers own transport validation and response shaping.
3. Controllers call application services and do not expose JPA entities as API
   responses.
4. Reads and commands are separate operations.
5. State-changing commands require idempotency keys where replay is possible.
6. Error responses use stable machine codes and avoid sensitive detail.
7. OpenAPI is generated in CI and checked for drift.
8. Breaking transport changes require `/v2` or a human-approved compatibility
   plan.
9. ADO-owned API responses use a common `ApiResponse<T>` wrapper. Domain DTOs
   are placed under `data`; they do not inherit from the common response type.
10. Success and failure responses share the same top-level fields:
    `success`, `code`, `message`, `data`, and `errors`.
11. Validation failures use `VALIDATION_FAILED` and return field-level errors
    with Korean messages.

Initial OpenAPI standard:

- springdoc-openapi or another explicit Spring-compatible generator produces
  the API description;
- the generated OpenAPI artifact is owned by `:apps:api:openApiGenerate`
  until LU-09 adds a root alias;
- the generated OpenAPI artifact path is
  `apps/api/build/openapi/openapi.json` unless LU-06 records a different
  Gradle-owned path;
- generated TypeScript client code is written to
  `apps/control/src/generated/api/`;
- drift between committed OpenAPI/client output and generated output fails CI;
- OpenAPI is the backend/frontend contract, not an LLM prompt format.

The exact springdoc-openapi version for the chosen Spring Boot line is
confirmation required during LU-06.

## 7. Worker Rules

A1 Worker scope is a process shell only: config validation, database preflight,
`--worker-id`, `--once`, and graceful shutdown.

Spring Batch is the Worker framework. Its JobRepository metadata is operational
metadata for batch execution, not the ADO product state model.

Stateful job leasing, artifacts, audit evidence, stale recovery, retry
behavior, and local LLM review loops require later State/Evidence/Job
contracts.

Worker rules:

1. one Worker process handles one ADO Job concurrently by default;
2. the Worker leases ADO Jobs from PostgreSQL, not Redis, Kafka, or a cloud
   queue in v1-alpha;
3. external tools, model calls, Git, and GitHub commands run outside database
   transactions;
4. local LLM output is stored as a structured ReviewResult claim;
5. every terminal attempt records facts, artifacts, and audit evidence;
6. SIGTERM/SIGINT triggers bounded drain and owned-child cleanup;
7. stale lease recovery is explicit and audited.

## 8. Next.js Control Room Rules

1. Next.js remains the primary Control Room UI.
2. The Control Room uses generated API clients or checked transport types.
3. The browser never receives database credentials, Worker secrets, raw provider
   payloads, or unredacted logs.
4. SSE is a freshness signal only. REST snapshots remain authoritative.
5. Command controls render from API-provided allowed actions, not local enum
   guesses.
6. npm is scoped to `apps/control`; root Java work does not depend on pnpm.

## 9. Local Reviewer And Feedback Rules

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

## 10. Branch And PR Rules

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

## 11. Completion Criteria For A1

A1 is complete only when:

1. `./gradlew test`, `./gradlew integrationTest`, `./gradlew build`,
   `./gradlew :apps:api:flywayMigrate`, `./gradlew :apps:api:flywayInfo`,
   `./gradlew :apps:api:openApiGenerate`, and their LU-09 root aliases exist
   and pass in a clean checkout where their prerequisites are available;
2. `./gradlew generateApiClient` writes generated TypeScript client output to
   `apps/control/src/generated/api/`;
3. `cd apps/control && npm run build` passes after the Control app exists;
4. Flyway migrations initialize the ADO database;
5. the Spring Boot API reports health/readiness and generates OpenAPI;
6. the Spring Batch Worker starts, preflights PostgreSQL, and exits gracefully;
7. the Next.js Control app reads API health through the generated contract;
8. CI verifies backend, frontend, OpenAPI, migration, and integration gates;
9. README and A1 documentation describe Spring Boot + Spring Batch as current.
