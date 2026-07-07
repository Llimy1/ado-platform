# A1 Foundation

## Current Status

A1 is intentionally not implemented yet.

The Human Owner has chosen to rebuild ADO Platform with Spring Boot, Spring
Batch, PostgreSQL, Flyway, JPA, Querydsl, local LLM review adapters, and Next.js
while learning each setup step.

New A1 work must follow:

- `docs/PLATFORM_SPRING_BATCH_RULES.md`
- `docs/LEARNING_FIRST_SETUP_PROTOCOL.md`
- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/SPRING_PROJECT_STRUCTURE.md`
- `docs/CONFIGURATION_POLICY.md`
- `docs/LEARNING_PR_POLICY.md`

## Learning-First Scope

A1 will be rebuilt through Learning Units instead of a generated skeleton:

1. LU-01 Java 21 and Gradle baseline
2. LU-02 Spring multi-project structure
3. LU-03 configuration and environment
4. LU-04 PostgreSQL and Flyway
5. LU-05 JPA and Querydsl persistence shell
6. LU-06 Spring Boot API health and OpenAPI
7. LU-07 Spring Batch worker shell
8. LU-08 Next Control health screen
9. LU-09 root command and CI surface

Each Learning Unit must explain the concept, list touched files, run a small
verification command, and leave a checkpoint summary before moving on.

## Target A1 Outcome

A1 is complete only when the repository contains a runnable Spring + Next.js
foundation:

- Java 21 pinned in `.java-version`
- Gradle wrapper and root multi-project build
- Spring Boot API with `GET /v1/health`
- Spring Batch Worker process shell with database preflight, `--worker-id`,
  `--once`, and graceful shutdown
- Next.js Control app with an API health panel
- PostgreSQL local development profile
- Flyway migration path
- Hibernate schema generation disabled for mutation, with validation only
- JPA entities and repositories for persistence basics
- Querydsl only where dynamic or dashboard-style queries justify it
- Testcontainers-backed PostgreSQL integration tests
- JdbcTemplate or reviewed native SQL for Worker locks, leases, and other
  PostgreSQL-specific behavior
- OpenAPI JSON generation at `apps/api/build/openapi/openapi.json` or another
  Gradle-owned path chosen during LU-06
- generated TypeScript API client under `apps/control/src/generated/api/`
- root Gradle tasks for test, integration, builds, migrations, OpenAPI, and
  generated client checks, with early Flyway/OpenAPI ownership in `:apps:api`
- npm scripts inside `apps/control` for the Control UI only
- CI baseline for the same gates

A1 does not complete the stateful Worker lease loop. Job leasing, artifacts,
audit evidence, stale recovery, retry behavior, local LLM review feedback
loops, and state transitions require later State/Evidence/Job contracts.

## Known Spec Alignment Gap

The current ADO Spec Library source defines
`SPRING_BOOT_PLATFORM_ARCHITECTURE.md` as the canonical implementation
architecture, but `ado-spec.lock.json` may still reference an older approved
manifest containing `NESTJS_MONOREPO_ARCHITECTURE.md`. Treat that as a known
alignment gap until the Spec Library revision is committed, released, imported,
and the lock is refreshed. Do not claim the Spring path is runtime-enforced by
the lock until that update is complete.
