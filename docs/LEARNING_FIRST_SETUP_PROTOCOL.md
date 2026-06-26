# ADO Learning-First Setup Protocol

## 1. Purpose

ADO Platform implementation must support the Human Owner learning Django,
Python, local LLM integration, and the platform architecture while building the
system. Codex must not skip the learning path by generating a complete
framework skeleton before the Human Owner has walked through the setup.

This protocol overrides any implementation habit that would make the first
project setup feel like a finished black box.

## 2. Core Principle

The first Django + Next platform setup is a guided build, not an auto-generated
drop-in skeleton.

Codex may:

- explain decisions before files are created;
- propose exact file contents in small steps;
- describe what each command proves;
- review Human Owner-created files;
- debug errors from terminal output;
- create small patches only after the Human Owner approves that step.

Codex must not:

- generate the full Django project tree in one automated patch;
- remove the historical Nest implementation before the Human Owner confirms
  the replacement path;
- hide setup commands behind abstractions before explaining them;
- run broad scaffolding commands without describing their output and purpose;
- treat green tests as sufficient if the Human Owner cannot explain what was
  created.

## 3. Learning Unit Model

The Django + Next transition proceeds through Learning Units.

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

### LU-01: Python And uv Baseline

Goal: understand why `uv` owns Python dependency and command execution.

Scope:

- inspect installed Python and `uv`;
- create or review `pyproject.toml`;
- understand direct dependencies vs dev dependencies;
- run `uv sync`;
- run a trivial Python command through `uv run`.

Checkpoint:

- the Human Owner can explain where dependencies are declared and where the
  lockfile comes from.

### LU-02: Django Project Creation

Goal: understand Django project structure before ADO domain code exists.

Scope:

- create `apps/api/manage.py`;
- create Django project package;
- inspect `settings`, `urls`, `asgi`, and `wsgi`;
- run `python manage.py check`;
- run the dev server.

Checkpoint:

- the Human Owner can explain the difference between project package, app, and
  management command.

### LU-03: Settings And Environment

Goal: understand non-secret configuration boundaries.

Scope:

- map `.env.example` variables to Django settings;
- add PostgreSQL database settings;
- explain why secrets are not committed;
- understand local/test/production settings separation.

Checkpoint:

- the Human Owner can explain which variables are safe examples and which
  values must stay local.

### LU-04: Django Ninja Health API

Goal: understand Django-to-Next API contract basics.

Scope:

- add Django Ninja;
- create `/v1/health`;
- return `ready` only after database preflight;
- generate OpenAPI;
- compare OpenAPI to the TypeScript contract.

Checkpoint:

- the Human Owner can explain why OpenAPI is a frontend/backend contract, not
  an LLM prompt.

### LU-05: PostgreSQL And Migrations

Goal: understand PostgreSQL as the ADO single source of truth.

Scope:

- start local PostgreSQL;
- run Django migrations;
- inspect created tables;
- understand why Worker does not auto-run migrations.

Checkpoint:

- the Human Owner can explain migration ownership and why production mutation
  is never automatic.

### LU-06: Python Worker Command

Goal: understand Worker process boundaries before queue leasing exists.

Scope:

- create a Django management command;
- preflight database connectivity;
- support `--worker-id`;
- support `--once`;
- handle graceful shutdown.

Checkpoint:

- the Human Owner can explain why the API process and Worker process are
  separate.

### LU-07: Next Control Health Screen

Goal: understand how the Control Room reads the Django API.

Scope:

- keep Next.js as the UI;
- fetch `/v1/health`;
- display loading, unavailable, ready, and retry states;
- use a checked TypeScript health response type.

Checkpoint:

- the Human Owner can explain why the browser never reads the database.

### LU-08: Root Command Surface

Goal: understand why `make` wraps Python and frontend commands.

Scope:

- add `make dev-api`;
- add `make dev-control`;
- add `make dev-worker`;
- add `make lint`, `make typecheck`, `make test`;
- keep the command bodies visible and simple.

Checkpoint:

- the Human Owner can explain which commands call `uv`, which call `pnpm`, and
  why `pnpm` does not orchestrate the backend.

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

- `Start LU-01 Python uv baseline`
- `Create LU-02 Django project shell`
- `Add LU-04 Django Ninja health API`

The first implementation PR after transition rules should not be "complete
skeleton reset." It should be a learning setup PR for LU-01 and LU-02 only,
unless the Human Owner explicitly expands scope.

## 7. Completion Criteria

This protocol is satisfied when:

1. the repository documents that the first Django + Next setup is learning-led;
2. Codex no longer auto-generates the full skeleton without approval;
3. implementation is split into Learning Units with command evidence;
4. each unit leaves the Human Owner with a clear explanation checkpoint;
5. later automation can still use the resulting files after they are created.
