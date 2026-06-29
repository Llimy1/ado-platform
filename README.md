# ADO Platform

ADO Platform is the control system for Agent Development Orchestrator.

It implements, but does not redefine, the ADO Spec Library. The active
immutable specification revision is pinned in `ado-spec.lock.json`.

## Current Stage

This repository is being rebuilt through a learning-first NestJS + TypeORM +
Next.js path.

The next implementation starts from framework setup and proceeds in small
Learning Units. Treat only the files and rules listed in the current policy
documents as active implementation guidance.

Read these before adding code:

- `docs/PLATFORM_NESTJS_TYPEORM_RULES.md`
- `docs/LEARNING_FIRST_SETUP_PROTOCOL.md`
- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/NESTJS_PROJECT_STRUCTURE.md`
- `docs/CONFIGURATION_POLICY.md`
- `docs/LEARNING_PR_POLICY.md`
- `docs/A1_FOUNDATION.md`

## Local Quick Start

There is no runnable application yet.

The first implementation step is LU-01 from
`docs/LEARNING_FIRST_SETUP_PROTOCOL.md`: Node.js and `pnpm` baseline setup.

Before LU-01, review `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md` so the editor,
Node.js, `pnpm`, PostgreSQL, and local-only file rules are clear.

LU-01 must also run the Spec Library preflight described in
`docs/PLATFORM_NESTJS_TYPEORM_RULES.md`. Any referenced Spec Library document
missing from `ado-spec.lock.json` is confirmation required before it is treated
as authority.

## Verification

There are no framework verification commands yet.

For documentation-only changes, run:

```bash
git diff --check
git status --short --ignored
```

As each Learning Unit creates real files, it must add the corresponding
verification commands and update this section.

## Safety

- `main` is human-controlled and protected.
- ADO work targets `integrate` through PRs only.
- Secrets, provider credentials, raw logs, and artifact payloads are not
  committed.
- `.idea/`, `.env`, and `.DS_Store` remain local-only unless a later PR
  explicitly allowlists a narrow shared editor setting.
- Every packet and run must be compatible with the pinned Spec Library revision.
