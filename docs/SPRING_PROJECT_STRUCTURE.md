# Spring Project Structure

## 1. Purpose

This document defines the target Spring Boot + Spring Batch structure for ADO
Platform. It is used when LU-02 starts creating the actual Gradle projects.

Do not generate the full future tree during LU-02. Create only the files needed
for the Learning Unit being implemented.

## 2. Initial Shape

LU-02 may create only this minimal shape:

```text
ado-platform/
  .java-version
  settings.gradle
  build.gradle
  gradle/
  gradlew
  gradlew.bat
  apps/
    api/
      build.gradle
      src/main/java/com/ado/platform/api/
      src/test/java/com/ado/platform/api/
    worker/
      build.gradle
      src/main/java/com/ado/platform/worker/
      src/test/java/com/ado/platform/worker/
    control/
      package.json
      package-lock.json
      src/
  docs/
```

`apps/control` is created only when the Next.js Learning Unit begins unless the
Human Owner explicitly wants the directory reserved earlier.

## 3. A1 Complete Shape

The target A1 structure is:

```text
ado-platform/
  apps/
    api/
    worker/
    control/
  modules/
    domain/
    application/
    persistence/
    contracts/
    runtime/
    testkit/
  infra/
    docker/
  docs/
  build.gradle
  settings.gradle
  gradlew
  gradlew.bat
  gradle/
  .java-version
  .env.example
```

Module creation is staged. Do not add `modules/*` until a Learning Unit needs
the boundary.

## 4. Package Rules

Base package:

```text
com.ado.platform
```

Target package ownership:

| Package area | Owns | Must not own |
|---|---|---|
| `api` | HTTP controllers, request/response DTOs, OpenAPI exposure | JPA entities, Worker logic |
| `worker` | Spring Batch jobs, process entry, Worker CLI args | HTTP controllers, migrations |
| `domain` | domain concepts and state rules | Spring annotations, database access |
| `application` | use cases and orchestration services | transport-specific DTOs |
| `persistence` | JPA entities, repositories, Querydsl, JdbcTemplate SQL | HTTP response shaping |
| `contracts` | API contract DTOs or generated artifacts chosen later | secrets, runtime config |
| `runtime` | configuration wiring and adapters | domain decisions |
| `testkit` | shared test fixtures | production behavior |

Forbidden dependencies:

- `domain` importing Spring, JPA, Querydsl, HTTP clients, or child-process
  tooling;
- controllers importing JPA repositories directly;
- Worker batch steps mutating ADO state without application service boundaries;
- frontend code importing backend Java artifacts;
- generated OpenAPI client code becoming the source of backend truth.

## 5. Gradle Rules

Use Gradle Groovy DSL.

Root `settings.gradle` owns project inclusion and dependency repositories.
Root `build.gradle` owns shared plugin versions, Java toolchain policy, and
common test configuration.

Project inclusion uses nested Gradle paths that match the directory layout:

```groovy
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
    }
}

rootProject.name = "ado-platform"

include 'apps:api'
include 'apps:worker'
```

Do not include `apps:worker` until the Worker project directory exists.

With this rule, the canonical project commands are:

```bash
./gradlew :apps:api:test
```

Add `./gradlew :apps:worker:test` only after `apps/worker` exists.

Each app/module owns its direct dependencies. Do not hide direct app
dependencies in unrelated shared modules for convenience.

The Gradle wrapper is committed. Developers and CI use `./gradlew`; installed
global Gradle is not a project requirement.

## 6. API App Layout

Initial API app:

```text
apps/api/src/main/java/com/ado/platform/api/
  AdoApiApplication.java
  health/
apps/api/src/main/resources/
  application.properties
```

Rules:

- route paths start under `/v1`;
- controllers return DTOs, not JPA entities;
- health reports database readiness only after database preflight exists;
- OpenAPI generation is a Gradle-owned task.

## 7. Worker App Layout

Initial Worker app:

```text
apps/worker/src/main/java/com/ado/platform/worker/
  AdoWorkerApplication.java
apps/worker/src/main/resources/
  application.properties
```

Rules:

- Worker is a separate process from the API;
- Spring Batch JobRepository metadata does not replace ADO state tables;
- Worker does not run Flyway migrations;
- `--worker-id` and `--once` are explicit process inputs;
- graceful shutdown is required before claiming Worker shell completion.

## 8. Persistence Layout

Flyway migrations live in the project that owns migration execution unless a
later LU extracts a persistence module:

```text
apps/api/src/main/resources/db/migration/
```

or, after extraction:

```text
modules/persistence/src/main/resources/db/migration/
```

Rules:

- migration filenames use Flyway conventions such as `V1__initial_schema.sql`;
- migrations are reviewed SQL files;
- the API project owns Flyway tasks during A1 setup, so early migration commands
  use `./gradlew :apps:api:flywayMigrate` and
  `./gradlew :apps:api:flywayInfo`;
- LU-09 may add root alias tasks named `flywayMigrate` and `flywayInfo`;
- Hibernate never auto-updates schema;
- PostgreSQL behavior must be verified on PostgreSQL, not SQLite or H2.

## 9. Querydsl Layout

Querydsl generated Q-classes are build output, not source files.

Preferred generated source location:

```text
apps/api/build/generated/querydsl/
```

Rules:

- generated Q-classes are not committed;
- annotation processor dependencies are declared in the owning Gradle project;
- LU-05 must add a verification command that proves Q-classes regenerate from
  source;
- Querydsl is introduced only when the first dynamic query needs it.

## 10. Next Control Layout

`apps/control` is a normal Next.js app with npm:

```text
apps/control/
  package.json
  package-lock.json
  src/
```

Rules:

- no root npm/pnpm workspace is introduced for A1;
- `node_modules/`, `.next/`, and local env files stay ignored;
- generated API client output lives under
  `apps/control/src/generated/api/`;
- `apps/control/src/generated/api/` is generated code; manual edits are not
  allowed unless a later policy explicitly changes ownership.

## 11. First Spring Checkpoint

LU-02 is complete only when:

1. Java 21 is visible through `.java-version`;
2. Gradle wrapper exists and runs;
3. `settings.gradle` includes only the projects actually created;
4. `./gradlew projects` or an equivalent Gradle check passes;
5. the Human Owner can explain app vs module vs package boundaries.
