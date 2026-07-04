# ADO Platform

ADO Platform is the control system for Agent Development Orchestrator.

It implements, but does not redefine, the ADO Spec Library. The active
immutable specification revision is pinned in `ado-spec.lock.json`.

## Current Stage

This repository is being reset to a learning-first Spring Boot + Spring Batch
+ PostgreSQL + Next.js path.

The backend and worker are Java applications managed by Gradle. The Control UI
is a Next.js app managed with npm inside `apps/control` only. There is no root
pnpm workspace.

Read these before adding code:

- `docs/PLATFORM_SPRING_BATCH_RULES.md`
- `docs/LEARNING_FIRST_SETUP_PROTOCOL.md`
- `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md`
- `docs/LEARNING_UNIT_TEMPLATE.md`
- `docs/SPRING_PROJECT_STRUCTURE.md`
- `docs/CONFIGURATION_POLICY.md`
- `docs/LEARNING_PR_POLICY.md`
- `docs/A1_FOUNDATION.md`

## Local Quick Start

There is no runnable application yet.

The next implementation step is LU-01 from
`docs/LEARNING_FIRST_SETUP_PROTOCOL.md`: Java 21 and Gradle baseline setup.

Before LU-01, review `docs/LOCAL_DEVELOPMENT_ENVIRONMENT.md` so Java, Gradle,
PostgreSQL, npm-for-Control, and local-only file rules are clear.

Important current constraint: `ado-spec.lock.json` still pins a Spec Library
document named `NESTJS_MONOREPO_ARCHITECTURE.md`. The Spring direction is the
Human Owner's repository-local decision until the Spec Library is updated
through its controlled change flow. Treat final Spec alignment as confirmation
required, not as already solved.

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
- `.idea/`, `.env`, `.DS_Store`, `.gradle/`, `build/`, `node_modules/`, and
  `.next/` remain local-only unless a later PR explicitly allowlists a narrow
  shared setting.
- Every packet and run must be compatible with the pinned Spec Library revision
  or documented as confirmation required.
