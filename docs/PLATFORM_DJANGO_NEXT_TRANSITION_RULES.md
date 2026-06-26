# ADO Platform Django + Next Transition Rules

## 1. Purpose

This document defines the repository-local rules for moving `ado-platform`
from the historical NestJS/TypeORM/Turborepo implementation to the approved
Django + Next architecture.

It implements the approved ADO Spec Library direction in
`DJANGO_NEXT_PLATFORM_ARCHITECTURE.md`. If this document conflicts with the
pinned Spec Library revision in `ado-spec.lock.json`, the Spec Library wins and
this document must be updated before implementation continues.

This document is a transition contract. It does not complete the platform
pivot by itself.

The first implementation pass must also follow
`docs/LEARNING_FIRST_SETUP_PROTOCOL.md`. That protocol exists because the
Human Owner wants to learn the project setup while building it. Do not replace
that learning path with a complete generated skeleton unless the Human Owner
explicitly changes this rule.

## 2. Non-Negotiable Principles

1. `main` is human-controlled and must not be targeted by ADO work.
2. All transition work targets `integrate` through pull requests.
3. The existing NestJS/TypeORM implementation is historical implementation
   evidence, not the target architecture.
4. PostgreSQL remains the single source of truth for orchestration state.
5. Markdown documents are working artifacts and are never more authoritative
   than database state.
6. The Worker does not run migrations automatically.
7. Browser code never reads PostgreSQL directly and never imports Python code.
8. Django Admin is inspection and emergency support, not the primary Control
   Room.
9. External agent/model output is a claim until validated by evidence gates.
10. Human Owner approval remains required for final merge.
11. The initial Django + Next setup is learning-led and proceeds in small
    Learning Units.

## 3. Source And Target Baseline

Current historical baseline:

- pnpm workspace;
- Turborepo task graph;
- NestJS API in `apps/api`;
- NestJS standalone Worker in `apps/worker`;
- TypeORM persistence packages and migrations;
- Next.js Control app in `apps/control`;
- PostgreSQL local Docker profile;
- generated OpenAPI artifact at `apps/api/openapi.json`.

Target baseline:

- Django + Django Ninja API in `apps/api`;
- Python Worker process, initially a Django management command or small Python
  entrypoint;
- Next.js App Router Control Room in `apps/control`;
- PostgreSQL with Django ORM plus reviewed PostgreSQL-specific migrations;
- OpenAPI generated from Django Ninja and consumed by generated TypeScript
  client code;
- `uv` for Python dependencies and tooling;
- `pnpm` for frontend and TypeScript tooling only;
- `Makefile` or `justfile` as the stable root command surface.

## 4. Delete, Preserve, And Recreate Rules

### 4.1 Remove Or Replace

These are replacement targets during the pivot:

- NestJS API source and NestJS runtime dependencies;
- NestJS Worker source and NestJS runtime dependencies;
- TypeORM DataSource, TypeORM entities, and TypeORM migration commands;
- Turborepo as the required cross-stack orchestrator;
- backend packages that exist only to support the TypeScript/Nest architecture:
  `packages/domain`, `packages/application`, `packages/persistence`,
  `packages/runtime`, `packages/config`, and TypeScript-only test helpers.

Removal must happen in focused PRs. A PR may leave temporary compatibility
files only when the PR description says why they remain and what later PR
removes them.

### 4.2 Preserve Or Reuse After Review

These may be preserved if they still match the new architecture:

- GitHub repository settings and branch safety rules;
- `.env.example` variable names that still apply;
- PostgreSQL Docker profile, with service names and ports adjusted only when
  necessary;
- Next.js Control app intent, copy, and UX patterns;
- docs that describe stable product behavior rather than the obsolete stack;
- OpenAPI endpoint intent, not Nest-specific generation code;
- test intent, acceptance criteria, and verification scenarios.

Preserve intent before preserving implementation. Code is reused only after it
passes the target architecture rules.

### 4.3 Recreate

These must be recreated under the Django + Next rules:

- Django project and settings modules;
- Django Ninja routers and schemas;
- Django models, migrations, admin registrations, and services;
- Python Worker command, lease loop, runner adapters, and recovery services;
- OpenAPI generation command and generated TypeScript client;
- root command surface;
- CI jobs for Python, frontend, OpenAPI, migrations, and integration tests.

## 5. Required Repository Shape

The target repository shape is:

```text
ado-platform/
  apps/
    api/
      manage.py
      ado_api/
        settings/
        urls.py
        asgi.py
        wsgi.py
      ado/
        core/
        projects/
        planning/
        components/
        artifacts/
        execution/
        verification/
        reviews/
        policy/
        state/
        audit/
        integrations/
    worker/
      ado_worker/
    control/
      src/
  packages/
    contracts/
    ui/
    design-tokens/
  infra/
    docker/
  docs/
  pyproject.toml
  uv.lock
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
  Makefile
  .env.example
```

The Worker may initially live under `apps/api` as a Django management command
if that reduces import complexity. Even then, API and Worker remain separate
processes with separate environment profiles.

## 6. Root Command Contract

Humans and agents use root commands. Root commands may delegate to `uv`,
`pnpm`, Django management commands, or frontend scripts.

Required target commands:

| Command | Required result |
|---|---|
| `make dev-api` | starts the Django API with validated local settings |
| `make dev-control` | starts the Next.js Control Room against the local API |
| `make dev-worker` | starts one Python Worker with a unique worker ID |
| `make lint` | runs Python and frontend lint checks |
| `make typecheck` | runs Python type checks where enabled and TypeScript typecheck |
| `make test` | runs deterministic Python and frontend tests |
| `make test-integration` | runs PostgreSQL-backed integration tests in an isolated database |
| `make build-control` | builds the Next.js Control Room |
| `make db-migrate` | applies reviewed Django migrations to the selected non-production database |
| `make db-plan` | reports pending migrations/checks without mutating production |
| `make openapi` | generates and checks the OpenAPI artifact |
| `make generate-client` | regenerates the TypeScript API client from OpenAPI |

Do not use `pnpm` as the backend orchestrator. `pnpm` remains valid for
frontend and TypeScript package tasks.

## 7. Django API Rules

1. API routes live under `/v1`.
2. Django Ninja owns request validation, response validation, and OpenAPI
   generation.
3. Routers call application services and do not mutate orchestration state
   directly.
4. Reads and commands are separate operations.
5. State-changing commands require idempotency keys where replay is possible.
6. Error responses use stable machine codes and avoid sensitive detail.
7. OpenAPI is generated in CI and checked for drift.
8. Breaking transport changes require `/v2` or a human-approved compatibility
   plan.

OpenAPI is the Django-to-Next contract. It is not an LLM prompt format.

## 8. Django ORM And PostgreSQL Rules

1. Durable models use UUID primary keys and UTC timestamps.
2. Business status is applied through the State Machine service.
3. Service methods wrap authoritative state changes in `transaction.atomic()`.
4. Django model `save()` overrides must not perform orchestration transitions.
5. Django signals must not silently change core orchestration state.
6. PostgreSQL-specific invariants use reviewed migrations, `RunSQL`, or custom
   migration operations.
7. Queue leasing uses PostgreSQL row locks and
   `select_for_update(skip_locked=True)`.
8. Worker processes never run migrations automatically.
9. Integration tests use an isolated test database and never share a developer
   database.

## 9. Python Worker Rules

The default Worker command shape is:

```text
uv run python apps/api/manage.py ado_worker --worker-id <unique-key>
```

Worker rules:

1. one Worker process handles one Job concurrently by default;
2. the Worker leases Jobs from PostgreSQL, not Redis, Celery, RQ, Kafka, or a
   cloud queue in v1-alpha;
3. external tools, model calls, Git, and GitHub commands run outside database
   transactions;
4. stdout, stderr, raw outputs, and generated files are stored as redacted
   artifacts;
5. runner output is validated before it can support a transition;
6. every terminal attempt records facts, artifacts, and audit evidence;
7. SIGTERM/SIGINT triggers bounded drain and owned-child cleanup;
8. stale lease recovery is explicit and audited.

## 10. Next.js Control Room Rules

1. Next.js remains the primary Control Room UI.
2. The Control Room uses generated API clients or checked transport types.
3. The browser never receives database credentials, Worker secrets, raw
   provider payloads, or unredacted logs.
4. SSE is a freshness signal only. REST snapshots remain authoritative.
5. Command controls render from API-provided allowed actions, not local enum
   guesses.
6. UI implementation follows the approved Control Room design system specs.
7. Django Admin may support inspection, but it does not replace this UI.

## 11. Django Admin Rules

Django Admin may:

- inspect Projects, Feature Units, Component Work, Jobs, Artifacts,
  transitions, reviews, and audit records;
- provide narrow service-backed emergency actions;
- expose search and filters for local operation.

Django Admin must not:

- edit `StateSubject.current_status` directly;
- bypass policy, evidence, state-machine, or audit paths;
- expose secrets, raw provider payloads, raw logs, or production data;
- become the default operator workflow.

## 12. Local Reviewer And Agent Adapter Rules

Allowed local reviewer adapters for v1:

- Ollama-hosted Llama;
- Qwen Coder;
- Devstral.

Local reviewer results are ReviewResult claims. Codex may arbitrate and
summarize them, but local model agreement is not completion evidence by
itself.

Claude Code interactive use remains human-assisted unless a later approved
spec defines a safe automated ingestion path.

## 13. Transition PR Sequence

The pivot proceeds in this order unless a later approved PR updates this list.

1. Transition rules: add this document and link it from repository docs.
2. Learning setup LU-01/LU-02: establish Python `uv` baseline and create the
   Django project shell with the Human Owner following each step.
3. Learning setup LU-03/LU-04: configure Django settings/environment and add
   the Django Ninja health API/OpenAPI path.
4. Learning setup LU-05/LU-06: connect PostgreSQL migrations and add the
   Python Worker command.
5. Learning setup LU-07/LU-08: connect Next health UI and root command surface.
6. A1 Django foundation closeout: health/readiness API, OpenAPI generation,
   Worker
   skeleton, PostgreSQL migration baseline, Control health panel.
7. A2 Django domain: core orchestration models, migrations, admin read views,
   and domain fixtures/tests.
8. State, policy, and evidence services: authoritative transitions and audit.
9. PostgreSQL queue and Worker lease loop: `Job`, `JobAttempt`, heartbeat,
   stale recovery, and retry behavior.
10. Artifact and document pipeline: DB-backed artifact lineage and generated
   working documents.
11. Control Room operational slice: Project, Feature Unit, Component Work, Job,
   Run, review, incident, and human gate screens.

Each PR states which step it implements, what obsolete files remain, and what
verification proves the step.

## 14. Branch And PR Rules

1. Branch from `integrate`.
2. Use focused branches with the `ado/` prefix.
3. Target PRs to `integrate`.
4. Do not merge to `main`.
5. Do not combine unrelated transition steps in one PR.
6. Document any temporary compatibility bridge in the PR body.
7. Every PR includes verification output or explains why a command is not
   applicable.

## 15. Completion Criteria For The Pivot

The Django + Next pivot is complete only when:

1. no active code path requires NestJS, TypeORM, or Turborepo;
2. `make lint`, `make typecheck`, `make test`, `make test-integration`,
   `make build-control`, `make openapi`, and `make generate-client` exist and
   pass in a clean checkout;
3. Django migrations initialize the ADO database without TypeORM artifacts;
4. the Django API reports health/readiness and generates OpenAPI;
5. the Python Worker starts, preflights PostgreSQL, and exits gracefully;
6. the Next.js Control app reads Django health through the generated contract;
7. CI verifies Python, frontend, OpenAPI, migration, and integration gates;
8. README and A1 documentation no longer describe the NestJS implementation as
   current.
