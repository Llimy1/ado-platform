# Local Development Environment

## 1. Purpose

This document defines the local development environment for rebuilding ADO
Platform from scratch with Spring Boot, Spring Batch, Gradle, Flyway, JPA,
Querydsl, PostgreSQL, local LLM review practice, and Next.js.

The goal is not only to make the app run. The goal is to make each setup step
understandable to the Human Owner.

## 2. Supported Local Machine

The first supported development machine is macOS.

Linux support may be added later after the local macOS path is stable.
Windows-specific process behavior is not part of the initial setup path.

## 3. Editor And Project Root

Open the repository root in the editor:

```text
<repo-root>
```

IntelliJ IDEA is the primary editor for the Spring path. WebStorm is acceptable
for `apps/control` when the Next UI exists.

Editor-generated files are local by default:

- `.idea/` is not committed unless the Human Owner explicitly decides to
  version a shared IDE setting.
- `.env` is never committed.
- `.DS_Store` is never committed.

## 4. Required Tools

LU-01 must verify tool versions before creating framework files.

Required tools:

| Tool | Purpose | Version rule |
|---|---|---|
| Java | Spring API and Worker runtime | Java 21 LTS |
| Gradle wrapper | project build execution | Gradle `8.14.5` wrapper |
| Docker or local PostgreSQL | local PostgreSQL | one local method is chosen during LU-04 |
| Git | branches, commits, PRs | required |
| GitHub CLI `gh` | PR workflow | recommended |
| Node.js | Next.js Control app only | decided when `apps/control` is created |
| npm | Next.js Control app only | use `package-lock.json` inside `apps/control` |

If a version is unknown, Codex must ask the Human Owner to run the version
command instead of guessing.

The local Java baseline is Java 21. The current machine has Temurin 21.0.11
available, and `.java-version` pins `21.0.11`.

The first Spring Boot API shell uses Spring Boot `3.5.16` and the Spring
dependency management Gradle plugin `1.1.7`.

Exact springdoc-openapi, Querydsl, Flyway, Testcontainers, and Next.js versions
must be checked against official compatibility docs during the Learning Unit
that pins them.

## 5. Java And Gradle Policy

Java dependencies are declared in Gradle build files and resolved through the
Gradle wrapper.

Gradle owns:

- Java dependency resolution;
- JVM test execution;
- Spring Boot app execution;
- Flyway migration tasks;
- OpenAPI generation tasks;
- generated client tasks when those tasks are introduced.

Do not install Spring Boot, Flyway, Querydsl, or Gradle plugins globally for
this project. Do not rely on whichever Java libraries happen to be installed
outside the repository.

Recommended first checks:

```bash
java -version
javac -version
./gradlew --version
```

Before the Gradle wrapper exists, `./gradlew --version` is expected to fail.
That failure is not a blocker; LU-01 creates the wrapper.

The first Gradle wrapper must be created by one of these visible methods:

- Spring Initializr output committed after inspection;
- a verified local Gradle installation running `gradle wrapper`;
- a separately documented wrapper bootstrap command that downloads from the
  official Gradle distribution service.

Do not hand-write `gradlew`, `gradlew.bat`, or files under `gradle/wrapper/`.
Do not rely on an unverified wrapper copied from another project.

## 6. Node And npm Boundary

Node.js is not a root platform dependency in A1. It is used only by the Next.js
Control app after `apps/control` exists.

Rules:

- no root `package.json`;
- no root `pnpm-workspace.yaml`;
- no root `pnpm-lock.yaml`;
- no root TypeScript workspace;
- `apps/control/package.json` and `apps/control/package-lock.json` own UI
  dependencies;
- root Gradle tasks may delegate to `npm` inside `apps/control` only after the
  Control app exists.

## 7. Local Environment Injection

Spring Boot does not automatically load repository `.env` files.

Allowed local injection methods:

- export variables in the shell before running `./gradlew ...`;
- configure IntelliJ run configurations with environment variables;
- use Docker Compose `env_file` for containers;
- source `.env` manually in a visible command before running a local process.

The application must not silently read `.env` through an added dotenv runtime
library during A1. If that changes later, `docs/CONFIGURATION_POLICY.md` must
be updated first.

## 8. PostgreSQL Local Policy

ADO uses PostgreSQL as the orchestration single source of truth.

The first local PostgreSQL setup should use one of these methods:

- Docker Compose inside the repository;
- an existing local PostgreSQL server.

Do not mix methods in one Learning Unit.

The default LU-04 path is Docker Compose inside the repository unless the Human
Owner explicitly chooses an existing local PostgreSQL server.

Default local values, unless changed during LU-04:

| Setting | Value |
|---|---|
| database | `ado_platform` |
| user | `ado` |
| password | `ado` |
| host | `localhost` |
| port | `5434` |

The non-default port `5434` avoids collisions with other local projects that
may already use `5432`.

Minimum Docker Compose runbook for LU-04:

```bash
docker compose --env-file .env -f infra/docker/compose.local.yml up -d postgres
docker compose --env-file .env -f infra/docker/compose.local.yml ps
docker compose --env-file .env -f infra/docker/compose.local.yml exec postgres pg_isready -U ado -d ado_platform
docker compose --env-file .env -f infra/docker/compose.local.yml exec postgres psql -U ado -d ado_platform -c "select version();"
./gradlew :apps:api:flywayInfo
./gradlew :apps:api:flywayMigrate
```

If `infra/docker/compose.local.yml` does not exist yet, LU-04 must create it
before claiming PostgreSQL setup is complete. If an existing local PostgreSQL
server is chosen instead, the LU summary must list equivalent `pg_isready`,
`psql`, and migration verification commands.

The local Compose file must read database values from `.env`; it must not
hard-code database names, users, passwords, or host ports. The repository uses
`.yml` for Docker Compose files.

For PostgreSQL 18 or newer Docker images, the local named volume must mount to
`/var/lib/postgresql`, not `/var/lib/postgresql/data`. PostgreSQL 18 images use
major-version-specific data directories below that mount point.

PostgreSQL-backed integration tests use Testcontainers by default. A Learning
Unit may use another isolated PostgreSQL method only when the PR explains why
Testcontainers is not appropriate.

## 9. Environment Files

`.env.example` is committed only after LU-03 defines the first required
variables.

`.env.example` may contain:

- non-secret local examples;
- placeholder values;
- comments explaining required variables.

`.env.example` must not contain:

- real provider keys;
- real GitHub tokens;
- private local file paths that reveal sensitive data;
- production credentials.

`.env` is local only and must remain ignored.

## 10. Local LLM Practice Boundary

Local LLM setup is allowed later, but it is not part of LU-01.

When local LLM review work begins:

- model installation is documented separately;
- model output is treated as a ReviewResult claim;
- Human/Codex decisions are recorded against findings;
- no model output becomes completion evidence without validation;
- local model paths and cache directories are not committed.

## 11. Local Cleanup Rules

The repository should stay understandable while learning.

Allowed local-only clutter:

- `.idea/`;
- `.env`;
- `.DS_Store`;
- `.gradle/`;
- `build/`;
- `node_modules/`;
- `.next/`;
- package-manager caches.

Before committing, run:

```bash
git status --short
git check-ignore -v .idea .env .DS_Store .gradle build node_modules .next
```

Only intentional source, config, lockfile, and documentation changes should be
staged.

The expected result is:

- local-only files are ignored;
- no private local path is added to committed documentation;
- any shared IDE setting is added only after the Human Owner explicitly
  approves a narrow allowlist.
