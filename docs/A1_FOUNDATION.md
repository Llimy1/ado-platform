# A1 Foundation

> Historical note: this document describes the original NestJS/TypeORM A1
> foundation. New implementation work follows
> `docs/PLATFORM_DJANGO_NEXT_TRANSITION_RULES.md` and the approved ADO Spec
> Library Django + Next architecture.

## Purpose

A1 creates the minimum runnable ADO Platform foundation. It does not implement
orchestration domain behavior yet. It proves that the monorepo, API, Control
app, Worker, PostgreSQL, migrations, OpenAPI artifact, and CI commands can all
run from one repository.

## Included

- pnpm workspace and Turborepo task graph
- NestJS API with `GET /v1/health`
- Next.js Control app with an API health panel
- Standalone Worker process with database preflight and graceful shutdown
- PostgreSQL Docker Compose profile
- TypeORM DataSource and initial bootstrap migration
- OpenAPI JSON generation at `apps/api/openapi.json`
- CI baseline for lint, typecheck, test, build, migration, and OpenAPI drift

## Excluded

- Project, Roadmap, Feature Unit, Component Work, and Agent Run tables
- Queue leasing and retry semantics
- Real SSE event stream
- Authentication and authorization
- Agent runner integrations
- GitHub PR automation beyond repository branch policy
- Production deployment hardening

## Local Environment

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

The default ADO PostgreSQL port is `5434`, not `5432`, so it can coexist with
other local project databases.

## Database

Start PostgreSQL:

```bash
docker compose -f infra/docker/compose.yaml up -d
```

Apply migrations:

```bash
pnpm db:migration:run
```

Check pending migrations:

```bash
pnpm db:migration:show
```

## API

Start the API after `pnpm build`:

```bash
pnpm --filter @ado/api start
```

Expected health response:

```json
{
  "status": "ready",
  "checkedAt": "2026-06-25T00:00:00.000Z"
}
```

`status` is `ready` only when the API can query PostgreSQL.

## Control App

Start the Control app:

```bash
pnpm --filter @ado/control dev
```

The first screen shows API health. A1 intentionally keeps the UI small because
the full Control Room page contracts are not implemented until the approved
spec revision is pinned in `ado-spec.lock.json`.

## Worker

Start the Worker after migrations:

```bash
pnpm --filter @ado/worker start
```

The A1 Worker performs a database preflight and remains alive until `SIGINT` or
`SIGTERM`. The real dequeue loop is a later phase.

## Acceptance Checklist

- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- `pnpm db:migration:run` applies the bootstrap migration or reports no work.
- `pnpm db:migration:show` reports no pending migrations after apply.
- `pnpm openapi:generate` writes `apps/api/openapi.json`.
- `GET /v1/health` returns `status: "ready"` against local PostgreSQL.
- The Worker starts, performs DB preflight, and exits cleanly on interrupt.
