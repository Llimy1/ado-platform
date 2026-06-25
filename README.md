# ADO Platform

ADO Platform is the control system for Agent Development Orchestrator.

It implements, but does not redefine, the ADO Spec Library. The active
immutable specification revision is pinned in `ado-spec.lock.json`.

## Current Stage

This repository is in A1 Foundation.

A1 provides the pnpm/Turborepo monorepo, NestJS API, standalone Worker,
Next.js Control app, PostgreSQL Docker profile, TypeORM migration baseline,
health checks, OpenAPI generation, and CI baseline.

## Local Quick Start

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose -f infra/docker/compose.yaml up -d
pnpm db:migration:run
pnpm build
pnpm --filter @ado/api start
pnpm --filter @ado/control dev
```

Default local URLs:

- Control UI: `http://localhost:3000`
- API health: `http://localhost:3001/v1/health`
- API docs: `http://localhost:3001/docs`
- OpenAPI JSON: `apps/api/openapi.json`

ADO's local PostgreSQL container maps host port `5434` to avoid common
conflicts with other projects that already use `5432`.

## Verification

Run these before opening an ADO Platform PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:migration:show
pnpm openapi:generate
git diff --exit-code -- apps/api/openapi.json
```

## Safety

- `main` is human-controlled and protected.
- ADO work targets `integrate` through PRs only.
- Secrets, provider credentials, raw logs, and artifact payloads are not
  committed.
- Every packet and run must be compatible with the pinned Spec Library revision.
