# ADO Platform

ADO Platform is the control system for Agent Development Orchestrator.

It implements, but does not redefine, the ADO Spec Library. The active
immutable specification revision is pinned in `ado-spec.lock.json`.

## Current Stage

This repository is transitioning from the historical NestJS A1/A2 foundation
to the approved Django + Next platform architecture.

The current NestJS/TypeORM/Turborepo implementation is historical
implementation evidence, not the target architecture for new work. Follow
`docs/PLATFORM_DJANGO_NEXT_TRANSITION_RULES.md` before changing platform code.

The first Django + Next implementation is learning-led. Follow
`docs/LEARNING_FIRST_SETUP_PROTOCOL.md`; do not generate a complete skeleton
before the setup steps have been discussed and approved.

## Local Quick Start

The commands below describe the historical NestJS foundation that currently
exists in the repository. They remain useful only for inspecting the old
baseline until the Django + Next skeleton PR replaces them.

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
