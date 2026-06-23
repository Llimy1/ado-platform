# ADO Platform

ADO Platform is the NestJS control system for Agent Development Orchestrator.

It implements, but does not redefine, the ADO Spec Library. The active
immutable specification revision is pinned in `ado-spec.lock.json`.

## Current Stage

This repository is in B0 bootstrap. A1 will add the pnpm/Turborepo monorepo,
Nest API, standalone Worker, Next.js Control app, PostgreSQL, TypeORM, health
checks, OpenAPI, and CI baseline.

## Safety

- `main` is human-controlled and protected.
- ADO work targets `integrate` through PRs only.
- Secrets, provider credentials, raw logs, and artifact payloads are not
  committed.
- Every packet and run must be compatible with the pinned Spec Library revision.
