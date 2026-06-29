# ADO Learning-First Setup Protocol

## 1. Purpose

ADO Platform implementation must support the Human Owner learning NestJS,
TypeScript, TypeORM, PostgreSQL, local LLM review integration, and the platform
architecture while building the system.

Codex must not skip the learning path by generating a complete framework
skeleton before the Human Owner has walked through the setup.

## 2. Core Principle

The first NestJS + TypeORM + Next.js platform setup is a guided build, not an
auto-generated drop-in skeleton.

Codex may:

- explain decisions before files are created;
- propose exact file contents in small steps;
- describe what each command proves;
- review Human Owner-created files;
- debug errors from terminal output;
- create small patches only after the Human Owner approves that step.

Codex must not:

- generate the full monorepo tree in one automated patch;
- hide setup commands behind abstractions before explaining them;
- run broad scaffolding commands without describing their output and purpose;
- treat green tests as sufficient if the Human Owner cannot explain what was
  created.

## 3. Learning Unit Model

The NestJS + TypeORM rebuild proceeds through Learning Units.

All commands in this document are run from the repository root unless a step
explicitly says otherwise.

Supporting policy documents:

- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/NESTJS_PROJECT_STRUCTURE.md`
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

### LU-01: Node.js And pnpm Baseline

Goal: understand why `pnpm` owns workspace dependency and command execution.

Required policy:

- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`

Scope:

- inspect installed Node.js, Corepack, and `pnpm`;
- decide the supported Node major version after checking local versions;
- create or review `package.json`;
- create or review `pnpm-workspace.yaml`;
- run `pnpm install` after the package metadata exists;
- run a trivial TypeScript or Node command through the workspace after the
  needed dependency or script exists.

Minimum command sequence:

```bash
node --version
corepack --version
pnpm --version
```

After `package.json` and `pnpm-workspace.yaml` exist:

```bash
pnpm install
pnpm exec tsc --version
```

If `package.json` or `pnpm-workspace.yaml` already exists, do not overwrite it
blindly. Review first and patch only the missing baseline fields.

Checkpoint:

- the Human Owner can explain where dependencies are declared and where the
  lockfile comes from.

### LU-02: NestJS Workspace And App Shells

Goal: understand app/package boundaries before ADO domain code exists.

Required policy:

- `docs/NESTJS_PROJECT_STRUCTURE.md`

Scope:

- create `apps/api` NestJS API shell;
- create `apps/worker` NestJS standalone process shell;
- reserve `apps/control` for Next.js;
- create initial `packages/contracts` and `packages/config`;
- run a TypeScript check or basic Nest build/check.

Minimum command sequence:

```bash
pnpm add -D typescript tsx @types/node
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
pnpm exec tsc --noEmit
```

Codex may use the Nest CLI only after explaining what it generates. Manual
file creation is allowed when it better matches the staged structure, but the
LU summary must list every file and why it exists.

Checkpoint:

- the Human Owner can explain the difference between application, package, and
  Nest module.

### LU-03: Settings And Environment

Goal: understand non-secret configuration boundaries.

Required policy:

- `docs/CONFIGURATION_POLICY.md`

Scope:

- map `.env.example` variables to typed config;
- add PostgreSQL database configuration;
- explain why secrets are not committed;
- separate API, Worker, frontend, test, and CI settings.

Minimum decisions before editing config:

- which library validates environment variables;
- whether shell environment overrides `.env`;
- which variables are required for API, Worker, frontend, and CI;
- how missing app secrets fail in non-test modes.

Checkpoint:

- the Human Owner can explain which variables are browser-visible and which
  values must stay local.

### LU-04: Nest Health API And OpenAPI

Goal: understand Nest-to-Next API contract basics.

Scope:

- add `/v1/health`;
- before LU-05, return a non-ready database state instead of pretending the
  database is ready;
- after LU-05, return `ready` only after database preflight;
- generate OpenAPI from Nest Swagger;
- compare OpenAPI to the TypeScript contract.

Minimum OpenAPI decisions before implementation:

- `apps/api/openapi.json` is the generated API artifact;
- `openapi-typescript` writes generated contract types under
  `packages/contracts/src/generated/`;
- checked TypeScript client code is written under `packages/contracts/src/`;
- `make openapi` regenerates or checks the OpenAPI artifact;
- `make generate-client` regenerates the TypeScript client from that artifact;
- drift between committed OpenAPI/client output and generated output fails CI.

Checkpoint:

- the Human Owner can explain why OpenAPI is a frontend/backend contract, not
  an LLM prompt.

### LU-05: PostgreSQL And TypeORM Migrations

Goal: understand PostgreSQL as the ADO single source of truth.

Scope:

- start local PostgreSQL;
- configure TypeORM DataSource;
- create an initial reviewed migration;
- run TypeORM migrations;
- inspect created tables;
- understand why Worker does not auto-run migrations.

Checkpoint:

- the Human Owner can explain migration ownership and why `synchronize` stays
  disabled.

### LU-06: Nest Worker Process Shell

Goal: understand Worker process boundaries before queue leasing exists.

Scope:

- create a Nest standalone application context;
- preflight database connectivity;
- support `--worker-id`;
- support `--once`;
- handle graceful shutdown.

Checkpoint:

- the Human Owner can explain why the API process and Worker process are
  separate.

### LU-07: Next Control Health Screen

Goal: understand how the Control Room reads the Nest API.

Scope:

- keep Next.js as the UI;
- fetch `/v1/health`;
- display loading, unavailable, ready, and retry states;
- use generated or checked TypeScript health response type.

Checkpoint:

- the Human Owner can explain why the browser never reads the database.

### LU-08: Root Command Surface

Goal: understand why `make` wraps backend, Worker, frontend, and database
commands.

Required policy:

- `docs/LEARNING_PR_POLICY.md`

Scope:

- add `make dev-api`;
- add `make dev-control`;
- add `make dev-worker`;
- add `make lint`, `make typecheck`, `make test`;
- add TypeORM migration/OpenAPI/client commands;
- keep the command bodies visible and simple.

`Makefile` is the initial root command standard.

Checkpoint:

- the Human Owner can explain which commands call `pnpm`, which call TypeORM,
  and why the Worker does not run migrations.

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

- `Start LU-01 Node pnpm baseline`
- `Create LU-02 Nest app shells`
- `Add LU-04 Nest health API`

The first implementation PR after this Nest policy update should be a learning
setup PR for LU-01 and LU-02 only unless the Human Owner explicitly expands
scope.

## 7. Completion Criteria

This protocol is satisfied when:

1. the repository documents that the first NestJS + TypeORM setup is
   learning-led;
2. Codex no longer auto-generates the full skeleton without approval;
3. implementation is split into Learning Units with command evidence;
4. each unit leaves the Human Owner with a clear explanation checkpoint;
5. later automation can still use the resulting files after they are created.
