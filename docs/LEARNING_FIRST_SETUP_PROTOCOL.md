# ADO Learning-First Setup Protocol

## 1. Purpose

ADO Platform implementation must support the Human Owner learning Spring Boot,
Spring Batch, Gradle, Flyway, JPA, Querydsl, PostgreSQL, local LLM review
integration, and the platform architecture while building the system.

Codex must not skip the learning path by generating a complete framework
skeleton before the Human Owner has walked through the setup.

## 2. Core Principle

The first Spring Boot + Spring Batch + Next.js platform setup is a guided build,
not an auto-generated drop-in skeleton.

Codex may:

- explain decisions before files are created;
- propose exact file contents in small steps;
- describe what each command proves;
- review Human Owner-created files;
- debug errors from terminal output;
- create small patches only after the Human Owner approves that step.

Codex must not:

- generate the full multi-project tree in one automated patch;
- hide setup commands behind abstractions before explaining them;
- run broad scaffolding commands without describing their output and purpose;
- treat green tests as sufficient if the Human Owner cannot explain what was
  created.

## 3. Learning Unit Model

The Spring rebuild proceeds through Learning Units.

All commands in this document are run from the repository root unless a step
explicitly says otherwise.

Supporting policy documents:

- `docs/PLATFORM_SPRING_BATCH_RULES.md`
- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/SPRING_PROJECT_STRUCTURE.md`
- `docs/CONFIGURATION_POLICY.md`
- `docs/LEARNING_PR_POLICY.md`

Each Learning Unit has:

1. a concept goal;
2. files to create or edit;
3. commands to run;
4. expected output;
5. common failure cases;
6. a short reflection checklist;
7. a commit checkpoint.

No Learning Unit should introduce more than one major framework concept unless
the Human Owner explicitly asks to move faster.

## 4. Required Learning Units

### LU-01: Java 21 And Gradle Baseline

Goal: understand why Java 21 and the Gradle wrapper own backend and Worker
build execution.

Required policy:

- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`

Scope:

- inspect installed Java;
- pin Java 21 through `.java-version`;
- create or review the Gradle wrapper through Spring Initializr, a verified
  local Gradle installation, or another documented official bootstrap method;
- create or review root `settings.gradle` and `build.gradle`;
- run a trivial Gradle command.

Minimum command sequence:

```bash
java -version
javac -version
/usr/libexec/java_home -v 21
```

After Gradle wrapper exists:

```bash
./gradlew --version
./gradlew projects
```

Do not hand-write Gradle wrapper scripts. The LU summary must state how the
wrapper was created and which Gradle version was pinned.

Checkpoint:

- the Human Owner can explain the difference between installed Java, Gradle
  wrapper, and project build files.

### LU-02: Spring Multi-Project Structure

Goal: understand app/module boundaries before ADO domain code exists.

Required policy:

- `docs/SPRING_PROJECT_STRUCTURE.md`

Scope:

- create `apps/api` Spring Boot API shell;
- defer `apps/worker` until the Worker shell Learning Unit unless the Human
  Owner explicitly chooses to create it earlier;
- reserve or defer `apps/control` for Next.js;
- include only projects that exist in `settings.gradle`;
- use `include 'apps:api'` for the API shell and add `include 'apps:worker'`
  only when the Worker project exists;
- run a Gradle project/build check.

Minimum command sequence:

```bash
./gradlew projects
./gradlew :apps:api:test
```

Add `./gradlew :apps:worker:test` only after `apps/worker` exists.

Codex may use Spring Initializr only after explaining what it generates. Manual
file creation is allowed when it better matches the staged structure, but the
LU summary must list every file and why it exists.

Spring Initializr settings for A1:

```text
Language: Java
Type: Gradle - Groovy
Java: 21
Packaging: Jar
Configuration: Properties
```

Checkpoint:

- the Human Owner can explain the difference between application, Gradle
  project, Java package, and future shared module.

### LU-03: Configuration And Environment

Goal: understand non-secret configuration boundaries.

Required policy:

- `docs/CONFIGURATION_POLICY.md`

Scope:

- map `.env.example` variables to Spring configuration properties;
- use `application.properties` for Spring config files during A1;
- add PostgreSQL database configuration;
- use `SPRING_PROFILES_ACTIVE` as the only Spring profile source;
- explain why secrets are not committed;
- separate API, Worker, frontend, test, and CI settings.

Minimum decisions before editing config:

- whether Spring Boot config properties are represented as records/classes;
- how local `.env` values are explicitly injected, because Spring Boot does
  not load `.env` by default;
- which variables are required for API, Worker, frontend, and CI;
- how missing app secrets fail in non-test modes.

Checkpoint:

- the Human Owner can explain which variables are browser-visible and which
  values must stay local.

### LU-04: PostgreSQL And Flyway

Goal: understand PostgreSQL as the ADO single source of truth and Flyway as the
only schema mutation path.

Scope:

- start local PostgreSQL;
- create local Docker Compose or explicitly choose an existing server;
- configure Flyway;
- create an initial reviewed migration;
- run Flyway migrations through the owning API project task;
- inspect created tables;
- understand why API/Worker processes do not invent schema at runtime.

Minimum command sequence after `infra/docker/compose.local.yml` and Flyway
configuration exist:

```bash
docker compose -f infra/docker/compose.local.yml up -d postgres
docker compose -f infra/docker/compose.local.yml exec postgres pg_isready -U ado -d ado_platform
./gradlew :apps:api:flywayInfo
./gradlew :apps:api:flywayMigrate
```

Checkpoint:

- the Human Owner can explain migration ownership and why Hibernate schema
  update stays disabled.

### LU-05: JPA And Querydsl Persistence Shell

Goal: understand how Java objects map to PostgreSQL without hiding database
behavior.

Scope:

- add a minimal JPA entity only after the table exists through Flyway;
- add repository/service boundary;
- add Querydsl only for a query that benefits from dynamic composition;
- configure annotation processing and generated Q-class output;
- keep JdbcTemplate/native SQL available for locks and leases;
- verify database behavior on PostgreSQL, using Testcontainers by default.

Minimum Querydsl evidence:

- the generated Q-class output directory is documented;
- generated Q-classes are not committed;
- the verification command proves Q-classes regenerate from source.

Checkpoint:

- the Human Owner can explain when to use JPA, when to use Querydsl, and when
  SQL/JdbcTemplate is clearer.

### LU-06: Spring Health API And OpenAPI

Goal: understand Spring-to-Next API contract basics.

Scope:

- add `/v1/health`;
- before LU-04/LU-05 readiness exists, return a non-ready database state;
- after database preflight exists, return `ready` only when checks pass;
- generate OpenAPI from Spring;
- document the TypeScript client generation target for the later Control UI.

Minimum OpenAPI decisions before implementation:

- the generated API artifact path is
  `apps/api/build/openapi/openapi.json` unless the LU records a better
  Gradle-owned path;
- `./gradlew :apps:api:openApiGenerate` or equivalent regenerates/checks the
  artifact;
- generated TypeScript client output is planned for
  `apps/control/src/generated/api/`;
- client generation itself may wait until LU-08 if `apps/control` does not
  exist yet;
- drift between committed OpenAPI output and generated output fails CI.

Checkpoint:

- the Human Owner can explain why OpenAPI is a frontend/backend contract, not
  an LLM prompt.

### LU-07: Spring Batch Worker Shell

Goal: understand Worker process boundaries before queue leasing exists.

Scope:

- create a Spring Batch application entry;
- preflight database connectivity;
- support `--worker-id`;
- support `--once`;
- handle graceful shutdown;
- separate Spring Batch metadata from ADO job state.

Checkpoint:

- the Human Owner can explain why the API process and Worker process are
  separate.

### LU-08: Next Control Health Screen

Goal: understand how the Control Room reads the Spring API.

Scope:

- create `apps/control` with Next.js and npm;
- generate or place the API client under `apps/control/src/generated/api/`;
- fetch `/v1/health`;
- display loading, unavailable, ready, and retry states;
- use generated or checked TypeScript health response type.

Minimum command sequence inside `apps/control`:

```bash
npm install
npm run dev
npm run build
```

Checkpoint:

- the Human Owner can explain why the browser never reads the database and why
  npm is local to the Control app.

### LU-09: Root Command And CI Surface

Goal: understand how Gradle becomes the root automation surface.

Required policy:

- `docs/LEARNING_PR_POLICY.md`

Scope:

- add or stabilize Gradle tasks for API, Worker, tests, Flyway, OpenAPI, and
  generated client checks;
- add root aliases for `:apps:api:flywayMigrate`, `:apps:api:flywayInfo`, and
  `:apps:api:openApiGenerate`;
- add frontend build delegation only after `apps/control` exists;
- keep command bodies visible and simple;
- add CI gates matching the same commands.

Checkpoint:

- the Human Owner can explain which commands are Gradle tasks, which are npm
  scripts inside `apps/control`, and why the Worker does not run migrations.

## 5. Codex Behavior During Learning Setup

For each Learning Unit, Codex should respond in this order:

1. explain the concept briefly;
2. list the exact files that will be touched;
3. show the command sequence;
4. wait for approval if the step creates framework structure;
5. make only the approved small edit;
6. run the relevant verification;
7. explain the result in plain language;
8. write a checkpoint summary.

Codex may combine steps only when the Human Owner explicitly says to move
faster.

## 6. Commit And PR Rules

Learning setup commits should be small and named by Learning Unit.

Recommended commit examples:

- `Start LU-01 Java Gradle baseline`
- `Create LU-02 Spring app shells`
- `Add LU-06 Spring health OpenAPI`

The first implementation PR after this Spring policy update should be a
learning setup PR for LU-01 and LU-02 only unless the Human Owner explicitly
expands scope.

## 7. Completion Criteria

This protocol is satisfied when:

1. the repository documents that the first Spring Boot + Spring Batch setup is
   learning-led;
2. Codex no longer auto-generates the full skeleton without approval;
3. implementation is split into Learning Units with command evidence;
4. each unit leaves the Human Owner with a clear explanation checkpoint;
5. later automation can still use the resulting files after they are created.
