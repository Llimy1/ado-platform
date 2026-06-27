# ADO Platform

ADO Platform is the control system for Agent Development Orchestrator.

It implements, but does not redefine, the ADO Spec Library. The active
immutable specification revision is pinned in `ado-spec.lock.json`.

## Current Stage

This repository has been reset for a learning-first Django + Next rebuild.

The historical NestJS/TypeORM/Turborepo implementation has been removed from
the active codebase. The next implementation starts from framework setup, not
from a pre-generated skeleton.

Read these before adding code:

- `docs/PLATFORM_DJANGO_NEXT_TRANSITION_RULES.md`
- `docs/LEARNING_FIRST_SETUP_PROTOCOL.md`
- `docs/A1_FOUNDATION.md`

## Local Quick Start

There is no runnable application yet.

The first implementation step is LU-01 from
`docs/LEARNING_FIRST_SETUP_PROTOCOL.md`: Python and `uv` baseline setup.

## Verification

There are no framework verification commands yet.

For documentation-only changes, run:

```bash
git diff --check
```

As each Learning Unit creates real files, it must add the corresponding
verification commands and update this section.

## Safety

- `main` is human-controlled and protected.
- ADO work targets `integrate` through PRs only.
- Secrets, provider credentials, raw logs, and artifact payloads are not
  committed.
- Every packet and run must be compatible with the pinned Spec Library revision.
