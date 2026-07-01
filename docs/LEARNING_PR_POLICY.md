# Learning PR Policy

## 1. Purpose

This document defines how pull requests should be shaped while ADO Platform is
rebuilt through Spring Boot + Spring Batch Learning Units.

The PR should prove both code progress and learning progress.

## 2. PR Size

Default rule:

```text
one Learning Unit = one PR
```

Exceptions are allowed only when:

- the Human Owner explicitly asks to combine units;
- the combined units are tightly coupled;
- the PR body explains why they were combined.

## 3. Commit Shape

Prefer one or two commits per Learning Unit:

1. setup or implementation;
2. docs/checkpoint update if needed.

Avoid large mixed commits that combine:

- framework setup;
- dependency changes;
- database changes;
- frontend UI;
- Worker behavior;
- cleanup.

## 4. Branch Naming

Use the `ado/` prefix.

Recommended branch names:

```text
ado/lu-01-java-gradle-baseline
ado/lu-02-spring-app-shells
ado/lu-03-configuration-policy
ado/lu-06-spring-health-openapi
```

Start every Learning Unit from the repository root with:

```bash
git status --short
git fetch origin
git switch integrate
git merge --ff-only origin/integrate
git switch -c ado/lu-XX-short-title
```

If the work is intentionally stacked on another branch, replace `integrate`
with the stack base and state that base in the PR body.

## 5. PR Body Template

```md
## Learning Unit

LU-XX: Title

## Goal

...

## What changed

- ...

## What I should be able to explain

- ...

## Verification

- [ ] command

## Evidence

Important output or summary:

```text
...
```

## Not included

- ...

## Follow-up

- ...
```

## 6. Required Verification

Every PR must include the mandatory verification for its Learning Unit. Extra
verification is encouraged when the PR claims broader behavior.

Documentation-only PRs that are not implementing a Learning Unit:

```bash
git diff --check
```

Learning Unit PRs must use the mandatory gate for their LU. Optional extra
commands may be included, but they do not replace the mandatory gate.

| LU | Mandatory verification from repo root | Claim boundary |
|---|---|---|
| LU-01 | `java -version`, `javac -version`, `./gradlew --version`, `./gradlew projects` after wrapper exists | Java and Gradle baseline only |
| LU-02 | `./gradlew projects`, `./gradlew :apps:api:test`; add `./gradlew :apps:worker:test` only after `apps/worker` exists | Spring app shells only |
| LU-03 | config validation command with documented env values | settings parse and fail-fast behavior only |
| LU-04 | PostgreSQL health check, `./gradlew :apps:api:flywayInfo`, and `./gradlew :apps:api:flywayMigrate` | PostgreSQL connectivity and migrations only |
| LU-05 | PostgreSQL-backed Testcontainers persistence test and Querydsl Q-class regeneration evidence | JPA/Querydsl persistence behavior only |
| LU-06 | API health test/check and `./gradlew :apps:api:openApiGenerate` | health route and OpenAPI artifact only |
| LU-07 | Worker command with `--worker-id local-dev --once` | Worker process shell only |
| LU-08 | `cd apps/control && npm run build` | browser/API health UI only |
| LU-09 | `./gradlew test`, `./gradlew integrationTest`, `./gradlew build`, root Flyway/OpenAPI aliases, plus Control build if UI exists | root command and CI surface only |

Reference examples:

Java setup PRs:

```bash
java -version
javac -version
./gradlew --version
./gradlew projects
```

Backend setup PRs:

```bash
./gradlew :apps:api:test
```

Add `./gradlew :apps:worker:test` only after `apps/worker` exists.

Database PRs:

```bash
docker compose -f infra/docker/compose.local.yml up -d postgres
./gradlew :apps:api:flywayInfo
./gradlew :apps:api:flywayMigrate
```

Frontend PRs:

```bash
cd apps/control
npm install
npm run build
```

The command must match the claim. Do not use a narrow command to prove a broad
behavior. A failing command may be recorded as evidence only when the PR is not
claiming the failed behavior is complete.

## 7. Learning Checkpoint

Before a PR is marked ready, the Human Owner should be able to answer:

1. What new tool or framework concept did this PR introduce?
2. Which files are framework-generated and which are ADO-authored?
3. Which command proves this step?
4. What is intentionally not implemented yet?
5. What is the next Learning Unit?

## 8. Review Policy

Codex review should check:

- whether the PR stayed inside the Learning Unit scope;
- whether generated framework files are understood and documented;
- whether secrets are absent;
- whether verification evidence matches the claim;
- whether the next step is clear.

Local reviewer models may provide comments later, but their output is only a
ReviewResult claim until Codex and the Human Owner inspect it.

## 9. Merge Policy

ADO does not merge to `main`.

During early learning setup:

- PRs target `integrate` unless stacked sequencing requires a temporary branch
  base;
- stacked PRs must say what they are stacked on;
- Human Owner approval is required before merge;
- if the Human Owner wants to practice GitHub merge flow manually, Codex should
  stop at PR creation.

Before a PR is merged, required checks must be rerun after the branch is up to
date with its target. The first CI baseline must define stable required check
names for backend, frontend, OpenAPI, migrations, and integration gates.

## 10. Completion Criteria

This policy is satisfied when each Learning Unit PR:

1. has a clear LU number and title;
2. has a small scope;
3. lists verification commands;
4. records what the Human Owner should understand;
5. avoids unrelated cleanup or framework jumps.
